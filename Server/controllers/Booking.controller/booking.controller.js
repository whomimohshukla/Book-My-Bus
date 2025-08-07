const Booking = require("../../models/Booking.Model/booking.model");
const Schedule = require("../../models/Schedule.model/schedule.model");
const User = require("../../models/User.Login.Signup/user.model");
const mailSender = require("../../utls/emailSender.utls/bookingEmail/bookingEmail");
const TravelRoute = require("../../models/TravelRoute.model/travelRoute.model");
const {
	createPaymentOrder,
	verifyPaymentSignature,
} = require("../../utls/payment.utils");

exports.initializeBooking = async (req, res) => {
	try {
		const { scheduleId, seats, passengers, contactDetails } = req.body;
		const userId = req.user._id;

		if (!userId || !scheduleId || !seats || !contactDetails || !passengers) {
			return res.status(400).json({
				success: false,
				message: "All fields are required",
			});
		}

		const schedule = await Schedule.findById(scheduleId);
		if (!schedule) {
			return res.status(404).json({
				success: false,
				message: "Schedule not found",
			});
		}

		const existingBookings = await Booking.find({
			scheduleId,
			status: "confirmed",
			"seats.seatNumber": { $in: seats.map((seat) => seat.seatNumber) },
		});

		if (existingBookings.length > 0) {
			return res.status(400).json({
				success: false,
				message: "One or more selected seats are already booked",
			});
		}

		const totalAmount = seats.reduce(
			(sum, seat) => sum + Number(seat.price),
			0
		);

		// Create booking with pending status
		const booking = await Booking.create({
			userId,
			scheduleId,
			seats,
			passengers,
			contactDetails,
			totalAmount,
			status: "pending",
			paymentStatus: "pending",
		});

		// Create Razorpay order AFTER we have a booking document (needed for receipt/notes)
		let razorpayOrder;
		try {
			razorpayOrder = await createPaymentOrder(booking);
			if (!razorpayOrder || !razorpayOrder.id) {
				throw new Error("Failed to create Razorpay order");
			}
		} catch (error) {
			console.error("Razorpay order creation failed:", error);
			// Clean up: delete the pending booking if payment order failed
			await Booking.findByIdAndDelete(booking._id).catch(() => {});
			return res.status(500).json({
				success: false,
				message: "Payment initialization failed",
				error: error.message,
			});
		}

		// Return necessary details for frontend payment
		res.status(200).json({
			success: true,
			data: {
				bookingId: booking._id,
				razorpayOrderId: razorpayOrder.id,
				amount: totalAmount,
				key: process.env.RAZORPAY_KEY_ID, // Frontend needs this to initialize Razorpay
				currency: razorpayOrder.currency,
				booking: {
					email: contactDetails.email,
					phone: contactDetails.phone,
				},
			},
			message: "Booking initialized successfully",
		});
	} catch (error) {
		console.error("Error initializing booking:", error);
		res.status(500).json({
			success: false,
			message: "Error while initializing booking",
		});
	}
};

// Verify payment and confirm booking
exports.confirmBooking = async (req, res) => {
	try {
		const {
			bookingId,
			razorpayOrderId,
			razorpayPaymentId,
			razorpaySignature,
		} = req.body;

		// Find the booking with pending payment
		const booking = await Booking.findOne({
			_id: bookingId,
			paymentStatus: "pending",
		});

		if (!booking) {
			return res.status(404).json({
				success: false,
				message: "Booking not found or already confirmed",
			});
		}

		// Verify payment signature
		try {
			const isValidPayment = await verifyPaymentSignature(
				razorpayOrderId,
				razorpayPaymentId,
				razorpaySignature
			);

			if (!isValidPayment) {
				return res.status(400).json({
					success: false,
					message: "Invalid payment signature",
				});
			}
		} catch (error) {
			console.error("Payment verification failed:", error);
			return res.status(400).json({
				success: false,
				message: "Payment verification failed",
			});
		}

		// Update booking status
		const updatedBooking = await Booking.findByIdAndUpdate(
			bookingId,
			{
				status: "confirmed",
				paymentStatus: "completed",
			},
			{ new: true }
		).populate([
			{ path: "userId", select: "name email" },
			{
				path: "scheduleId",
				populate: [
					{
						path: "routeId",
						select: "source destination routeName",
					},
					{
						path: "busId",
						select: "busNumber busType",
					},
				],
			},
		]);

		// Update available seats in schedule
		await Schedule.findByIdAndUpdate(booking.scheduleId, {
			$inc: { availableSeats: -booking.seats.length },
		});

		// Send booking confirmation email
		try {
			await mailSender.sendBookingConfirmation(
				updatedBooking,
				updatedBooking.scheduleId
			);
		} catch (error) {
			console.error("Error sending confirmation email:", error);
			// Don't return error to client as booking is successful
		}

		res.status(200).json({
			success: true,
			data: updatedBooking,
			message: "Booking confirmed successfully",
		});
	} catch (error) {
		console.error("Error confirming booking:", error);
		res.status(500).json({
			success: false,
			message: "Error while confirming booking",
		});
	}
};

// Get booking details
exports.getBookingDetails = async (req, res) => {
	try {
		const { bookingId } = req.params;
		const userId = req.user._id;

		// Allow admins/operators to fetch any booking
		const isPrivileged = req.user.role && ["Admin", "Operator"].includes(req.user.role);
		const bookingQuery = isPrivileged ? { _id: bookingId } : { _id: bookingId, userId };
		const booking = await Booking.findOne(bookingQuery).populate([
			{ path: "userId", select: "name email" },
			{
				path: "scheduleId",
				populate: [
					{
						path: "routeId",
						select: "source destination routeName",
					},
					{
						path: "busId",
						select: "busNumber busType",
					},
				],
			},
		]);

		if (!booking) {
			return res.status(404).json({
				success: false,
				message: "Booking not found",
			});
		}

		let routeIdForCoords = booking.routeId;
		// Fallback: derive routeId through schedule
		if (!routeIdForCoords && booking.scheduleId) {
			try {
				const Schedule = require("../../models/Schedule.model/schedule.model");
				const scheduleDoc = await Schedule.findById(booking.scheduleId).lean();
				if (scheduleDoc && scheduleDoc.routeId) routeIdForCoords = scheduleDoc.routeId;
			} catch (e) {
				console.error("Failed to load routeId from schedule", e);
			}
		}

		let bookingResponse = booking;

		if (routeIdForCoords) {
			const route = await TravelRoute.findById(routeIdForCoords).lean();
			if (route && route.source && route.destination) {
				// Convert to plain object once to safely append new props
				bookingResponse = booking.toObject();
				bookingResponse.boardingCoords = route.source.location.coordinates; // [lon, lat]
				bookingResponse.droppingCoords = route.destination.location.coordinates;
        bookingResponse.stops = (route.viaStops || []).filter(s => Array.isArray(s.location?.coordinates) && s.location.coordinates.length===2).map(s => ({ name: s.name, coords: s.location.coordinates }));
			}
		}

		res.status(200).json({
			success: true,
			data: bookingResponse,
		});
	} catch (error) {
		console.error("Error fetching booking details:", error);
		res.status(500).json({
			success: false,
			message: "Error while fetching booking details",
		});
	}
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
	try {
		const { bookingId } = req.params;
		const { reason } = req.body;
		const userId = req.user._id;

		const booking = await Booking.findOne({
			_id: bookingId,
			userId,
			status: "confirmed",
		});

		if (!booking) {
			return res.status(404).json({
				success: false,
				message: "Booking not found or already cancelled",
			});
		}

		// Calculate refund amount based on your business logic
		const refundAmount = calculateRefundAmount(booking);

		// Update booking status
		booking.status = "cancelled";
		booking.cancellationDetails = {
			cancelledAt: new Date(),
			reason,
			refundAmount,
			refundStatus: "pending",
		};

		await booking.save();

		// Update available seats in schedule
		await Schedule.findByIdAndUpdate(booking.scheduleId, {
			$inc: { availableSeats: booking.seats.length },
		});

		// Send cancellation email
		await mailSender.sendBookingCancellation(booking);

		res.status(200).json({
			success: true,
			data: booking,
			message: "Booking cancelled successfully",
		});
	} catch (error) {
		console.error("Error cancelling booking:", error);
		res.status(500).json({
			success: false,
			message: "Error while cancelling booking",
		});
	}
};

// Get user's booking history
exports.getUserBookings = async function (req, res) {
	try {
		const userId = req.user._id;
		const { status, type } = req.query;

		// Build query based on filters
		const query = { userId };
		if (status) {
			query.status = status;
		}

		// Fetch bookings with proper population
		const bookings = await Booking.find(query)
			.sort({ "scheduleId.departureTime": -1 })
			.populate([
				{ path: "userId", select: "name email" },
				{
					path: "scheduleId",
					populate: [
						{
							path: "routeId",
							select: "source destination routeName",
						},
						{
							path: "busId",
							select: "busNumber busType",
						},
					],
				},
			]);

		// Categorize bookings
		const categorizedBookings = {
			upcoming: [],
			past: [],
			cancelled: [],
		};

		bookings.forEach((booking) => {
			const departureTime = new Date(booking.scheduleId.departureTime);
			const now = new Date();

			if (booking.status === "cancelled") {
				categorizedBookings.cancelled.push(booking);
			} else if (departureTime < now) {
				categorizedBookings.past.push(booking);
			} else {
				categorizedBookings.upcoming.push(booking);
			}
		});

		res.status(200).json({
			success: true,
			data: categorizedBookings,
			message: "Bookings retrieved successfully",
		});
	} catch (error) {
		console.error("Error fetching user bookings:", error);
		res.status(500).json({
			success: false,
			message: "Error while fetching user bookings",
		});
	}
};

// Retry payment for pending booking
exports.retryPayment = async (req, res) => {
	try {
		const { bookingId } = req.body;
		const userId = req.user._id;

		if (!bookingId) {
			return res
				.status(400)
				.json({ success: false, message: "bookingId is required" });
		}

		const booking = await Booking.findOne({
			_id: bookingId,
			userId,
			paymentStatus: "pending",
		});

		if (!booking) {
			return res
				.status(404)
				.json({ success: false, message: "Pending booking not found" });
		}

		// Create fresh Razorpay order
		let order;
		try {
			order = await createPaymentOrder(booking);
		} catch (err) {
			console.error("Retry payment: Razorpay order creation failed", err);
			return res
				.status(500)
				.json({ success: false, message: "Payment initialization failed" });
		}

		// Store last retry attempt info (optional)
		booking.paymentDetails = {
			...booking.paymentDetails,
			lastRetryOrderId: order.id,
			lastRetryAt: new Date(),
		};
		await booking.save();

		return res.json({
			success: true,
			data: {
				key: process.env.RAZORPAY_KEY_ID,
				amount: booking.totalAmount,
				currency: order.currency,
				razorpayOrderId: order.id,
				bookingId: booking._id,
				contact: booking.contactDetails,
			},
		});
	} catch (error) {
		console.error("Error in retryPayment:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// ------------------------------------------------------------------
// Seat recommendations
// GET /api/booking/recommendations?scheduleId=xxx&travelHistory=1&preferences=1&groupSize=2
exports.getSeatRecommendations = async (req, res) => {
  try {
    const { scheduleId, travelHistory, preferences, groupSize = 1 } = req.query;
    if (!scheduleId) return res.status(400).json({ success:false, message:"scheduleId required" });
    const schedule = await Schedule.findById(scheduleId).populate("busId");
    if (!schedule) return res.status(404).json({ success:false, message:"Schedule not found" });

    // total seats
    const totalSeats = schedule.busId?.totalSeats || 32;
    const seatNumbers = Array.from({length: totalSeats}, (_,i)=> i+1);

    // booked seats
    const bookings = await Booking.find({scheduleId, status:{ $in:["pending","confirmed","completed"]}}).select("seats");
    const bookedSet = new Set();
    bookings.forEach(b=> b.seats.forEach(s=> bookedSet.add(parseInt(s.seatNumber||s))));

    // very naive recommendation: earliest available contiguous block matching groupSize
    const recommendations = [];
    for (let i=0;i<seatNumbers.length;i++) {
      const slice = seatNumbers.slice(i,i+Number(groupSize));
      if (slice.length===Number(groupSize) && slice.every(n=> !bookedSet.has(n))) {
        recommendations.push(...slice);
        break;
      }
    }

    return res.json({ success:true, seats: recommendations });
  } catch(err){
    console.error("getSeatRecommendations", err);
    res.status(500).json({ success:false, message:"Server error"});
  }
};

// ------------------------------------------------------------------
// Group booking
// POST /api/booking/group { scheduleId, groupSize, seatingPreference, passengers }
exports.createGroupBooking = async (req, res) => {
  try {
    const { scheduleId, groupSize, seatingPreference = "together", passengers, contactDetails } = req.body;
    const userId = req.user._id;
    if (!scheduleId || !groupSize || !passengers || passengers.length!==groupSize) {
      return res.status(400).json({ success:false, message:"scheduleId, groupSize, passengers required" });
    }
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) return res.status(404).json({ success:false, message:"Schedule not found" });

    // compute available seats
    const totalSeats = 32;
    const allSeats = Array.from({length: totalSeats}, (_,i)=> i+1);
    const booked = await Booking.find({scheduleId, status:{ $in:["pending","confirmed","completed"]}}).select("seats");
    const bookedSet = new Set();
    booked.forEach(b=> b.seats.forEach(s=> bookedSet.add(parseInt(s.seatNumber||s))));

    let chosen = [];
    if (seatingPreference === "together") {
      for (let i=0;i<allSeats.length;i++) {
        const slice = allSeats.slice(i,i+Number(groupSize));
        if (slice.length===Number(groupSize) && slice.every(n=> !bookedSet.has(n))) { chosen = slice; break; }
      }
    }
    if (!chosen.length) { // fallback pick first available
      chosen = allSeats.filter(n=> !bookedSet.has(n)).slice(0, groupSize);
    }
    if (chosen.length!==Number(groupSize)) return res.status(400).json({ success:false, message:"Not enough seats available" });

    const fareB = schedule.fareDetails?.baseFare || schedule.fareDetails?.fare || 0;
    const fareT = schedule.fareDetails?.tax || 0;
    const fareS = schedule.fareDetails?.serviceFee || 0;
    const seatPrice = fareB + fareT + fareS;
    const seatObjs = chosen.map(n=> ({ seatNumber: n.toString(), price: seatPrice }));
    const totalAmount = seatObjs.reduce((acc,s)=> acc+s.price,0);

    const booking = await Booking.create({
      userId,
      scheduleId,
      seats: seatObjs,
      passengers,
      contactDetails,
      status: "pending",
      totalAmount,
      paymentStatus: "pending",
      groupSize
    });

    // respond with bookingId and seat list; frontend will reuse existing retry-payment endpoint to pay
    res.status(201).json({ success:true, data:{ bookingId: booking._id, seats: chosen, totalAmount } });
  } catch(err){
    console.error("createGroupBooking", err);
    res.status(500).json({ success:false, message:"Server error"});
  }
};

// ------------------------------------------------------------------
// Flexible-date fares
// GET /api/booking/flexible-dates?source=CityA&destination=CityB&start=YYYY-MM-DD&end=YYYY-MM-DD
exports.getFlexibleDateFares = async (req, res) => {
  try {
    const { source, destination, start, end } = req.query;
    if (!source || !destination || !start || !end) {
      return res.status(400).json({ success: false, message: "source, destination, start and end are required" });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate) || isNaN(endDate) || startDate > endDate) {
      return res.status(400).json({ success: false, message: "Invalid date range" });
    }

    const TravelRoute = require("../../models/TravelRoute.model/travelRoute.model");
    const routes = await TravelRoute.find({
      "source.name": new RegExp(`^${source}$`, "i"),
      "destination.name": new RegExp(`^${destination}$`, "i"),
    }).select("_id");

    if (!routes.length) return res.json([]);

    const routeIds = routes.map(r => r._id);

    const schedules = await Schedule.find({
      routeId: { $in: routeIds },
      departureTime: { $gte: startDate, $lte: endDate },
      status: "Active",
    }).select("departureTime fareDetails").lean();

    const fareMap = {};
    schedules.forEach(sch => {
      const dateKey = sch.departureTime.toISOString().split("T")[0];
      const fare = (sch.fareDetails?.baseFare || 0) + (sch.fareDetails?.tax || 0) + (sch.fareDetails?.serviceFee || 0);
      if (!fareMap[dateKey] || fare < fareMap[dateKey].minFare) {
        fareMap[dateKey] = { date: dateKey, minFare: fare, schedules: 1 };
      } else {
        fareMap[dateKey].schedules += 1;
      }
    });

    return res.json(Object.values(fareMap).sort((a,b)=> new Date(a.date)-new Date(b.date)));
  } catch (err) {
    console.error("getFlexibleDateFares error", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Helper function to calculate refund amount
function calculateRefundAmount(booking) {
	// Implement your refund calculation logic here
	// This is a simple example - you should adjust based on your business rules
	const cancellationTime = new Date();
	const bookingTime = new Date(booking.createdAt);
	const hoursDifference = (cancellationTime - bookingTime) / (1000 * 60 * 60);

	if (hoursDifference <= 24) {
		return booking.totalAmount * 0.9; // 90% refund if cancelled within 24 hours
	} else if (hoursDifference <= 48) {
		return booking.totalAmount * 0.7; // 70% refund if cancelled within 48 hours
	} else {
		return booking.totalAmount * 0.5; // 50% refund if cancelled after 48 hours
	}
}
