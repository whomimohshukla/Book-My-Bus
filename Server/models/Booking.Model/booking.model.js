const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedule",
    required: true,
  },
  bookingDate: { type: Date, default: Date.now },
  journeyDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Confirmed", "Cancelled", "Pending"],
    default: "Pending",
  },
  totalAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["Paid", "Failed", "Pending"],
    default: "Pending",
  },
  passengers: [
    {
      name: { type: String, required: true },
      age: { type: Number, required: true },
      gender: { type: String, enum: ["Male", "Female", "Other"] },
      seatNumber: { type: String, required: true },
    },
  ],
  contactDetails: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  cancellation: {
    cancelledAt: { type: Date },
    reason: { type: String },
    refundAmount: { type: Number },
    refundStatus: { type: String },
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
