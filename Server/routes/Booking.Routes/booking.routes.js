// routes/booking.routes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../../controllers/Booking.controller/booking.controller");
const { auth } = require("../../middleware/User.Auth.Middleware"); // Your auth middleware

// Create booking
// router.post("/createBooking", auth, bookingController.createBooking);

// Get user bookings
// router.get("/user/:userId", auth, bookingController.getUserBookings);

// Get single booking
// router.get("/:id", auth, bookingController.getBooking);

// Cancel booking
// router.put("/:id/cancel", auth, bookingController.cancelBooking);

router.post("/initialize", auth, bookingController.initializeBooking);
router.post("/confirm", auth, bookingController.confirmBooking);
router.get(
  "/details/:bookingId",
  auth,
  bookingController.getBookingDetails
);
router.post(
  "/cancel/:bookingId",
  auth,
  bookingController.cancelBooking
);
router.get("/user-bookings", auth, bookingController.getUserBookings);

module.exports = router;
