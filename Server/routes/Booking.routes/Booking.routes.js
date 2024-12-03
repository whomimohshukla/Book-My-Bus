const express = require("express");
const router = express.Router();

const auth = require("../../middleware/User.Auth.Middleware");
const validateSchedule = require("../../middleware/Schedule.middleware");
const bookingController = require("../../controllers/Booking.controller/booking.controller");

router.post(
  "/bookings",
  auth,
  validateSchedule,
  bookingController.createBooking
);

module.exports = router;
