// routes/booking.routes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../../controllers/Booking.controller/booking.controller");
const { auth } = require("../../middleware/User.Auth.Middleware"); // Your auth middleware

// Create booking
router.post("/createBooking", auth, bookingController.createBooking);

// Get user bookings
router.get("/user/:userId", auth, bookingController.getUserBookings);

// Get single booking
router.get("/:id", auth, bookingController.getBooking);

// Cancel booking
router.put("/:id/cancel", auth, bookingController.cancelBooking);

module.exports = router;
