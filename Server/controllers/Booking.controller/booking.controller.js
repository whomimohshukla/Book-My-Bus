const Booking = require("../../models/Booking.Model/booking.model");

// Define a constant for price per kilometer
const PRICE_PER_KM = process.env.PRICE_PER_KM; // Example price per kilometer

exports.createBooking = async (req, res) => {
  try {
    const { journeyDate, passengers, contactDetails } = req.body;

    // Extract userId from auth middleware
    const userId = req.userId;

    // Extract schedule from validateSchedule middleware
    const schedule = req.schedule;

    // Ensure all required fields are present
    if (!journeyDate || !passengers || !contactDetails) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    // Check seat availability
    const seatNumbers = passengers.map((p) => p.seatNumber);
    const bookedSeats = await Booking.find({
      scheduleId: schedule._id,
      "passengers.seatNumber": { $in: seatNumbers },
      status: { $ne: "Cancelled" },
    });

    if (bookedSeats.length > 0) {
      return res.status(400).json({
        message: "Some seats are already booked.",
        bookedSeats: bookedSeats
          .map((b) => b.passengers.map((p) => p.seatNumber))
          .flat(),
      });
    }

    // Calculate total amount based on distance
    const distance = schedule.distance; // Assume distance is part of the schedule
    if (!distance || distance <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid distance for the selected schedule." });
    }

    // Calculate the total amount
    const totalAmount = distance * PRICE_PER_KM;

    // Create the booking
    const booking = new Booking({
      userId,
      scheduleId: schedule._id,
      journeyDate,
      totalAmount,
      passengers,
      contactDetails,
    });

    await booking.save();

    res
      .status(201)
      .json({ message: "Booking created successfully.", data: booking });
  } catch (error) {
    console.error("Error creating booking:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};
