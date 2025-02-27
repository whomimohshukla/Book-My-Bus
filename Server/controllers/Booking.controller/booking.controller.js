const Booking = require("../../models/Booking.Model/booking.model");
const Schedule = require("../../models/Schedule.model/schedule.model");
const User = require("../../models/User.Login.Signup/user.model");
const mailSender = require("../../utls/emailSender.utls/bookingEmail/bookingEmail");
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

    const totalAmount = seats.reduce((sum, seat) => sum + seat.price, 0);

    // Create Razorpay order
    let razorpayOrder;
    try {
      razorpayOrder = await createPaymentOrder(totalAmount);
      if (!razorpayOrder || !razorpayOrder.id) {
        throw new Error("Failed to create Razorpay order");
      }
    } catch (error) {
      console.error("Razorpay order creation failed:", error);
      return res.status(500).json({
        success: false,
        message: "Payment initialization failed",
        error: error.message,
      });
    }

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
    const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      req.body;

    // Find the pending booking
    const booking = await Booking.findOne({
      _id: bookingId,
      status: "pending",
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

    const booking = await Booking.findOne({
      _id: bookingId,
      userId,
    }).populate([
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

    res.status(200).json({
      success: true,
      data: booking,
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
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    const query = { userId };
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
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

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching user bookings",
    });
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
