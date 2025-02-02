const Booking = require("../../models/Booking.Model/booking.model");
const Schedule = require("../../models/Schedule.model/schedule.model");
const User = require("../../models/User.Login.Signup/user.model");
const mailSender = require("../../utls/emailSender.utls/bookingEmail/bookingEmail");
const {
  createPaymentOrder,
  verifyPaymentSignature,
} = require("../../utls/payment.utils");

exports.createBooking = async (req, res) => {
  try {
    const { scheduleId, seats, passengers, contactDetails } = req.body;
    const userId = req.user._id;

    // Validate user exists

    if (!userId || !scheduleId || !seats || !contactDetails || !passengers) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }

    // Validate schedule exists and seats are available
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }
    // Check if seats are available
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

    // Calculate total amount
    const totalAmount = seats.reduce((sum, seat) => sum + seat.price, 0);

    // Create booking
    const booking = await Booking.create({
      userId,
      scheduleId,
      seats,
      passengers,
      contactDetails,
      totalAmount,
      status: "pending",
      paymentStatus: "pending", // You might want to integrate with a payment gateway
    });

    // Populate necessary fields
    const populatedBooking = await booking.populate([
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

    // Add debug logging
    console.log("Populated booking data:", {
      route: populatedBooking.scheduleId.routeId,
      bus: populatedBooking.scheduleId.busId,
    });

    // Send booking confirmation email with the populated schedule data
    // await mailSender.sendBookingConfirmation(
    //   populatedBooking,
    //   populatedBooking.scheduleId
    // );

    res.status(201).json({
      success: true,
      data: populatedBooking,
      message: "booking successfully",
    });
  } catch (error) {
    console.error("Error creating booking:", error.message);
    res.status(500).json({
      success: false,
      message: "error while creating booking",
    });
  }
};
