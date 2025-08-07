// routes/booking.routes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../../controllers/Booking.controller/booking.controller");
const { auth } = require("../../middleware/User.Auth.Middleware"); // Your auth middleware



router.post("/initialize", auth, bookingController.initializeBooking);
router.post("/confirm", auth, bookingController.confirmBooking);
router.post("/retry-payment", auth, bookingController.retryPayment);
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

// Flexible date fares (public)
router.get("/flexible-dates", bookingController.getFlexibleDateFares);

// Seat recommendations (auth)
router.get("/recommendations", auth, bookingController.getSeatRecommendations);

// Group booking (auth)
router.post("/group", auth, bookingController.createGroupBooking);

module.exports = router;
