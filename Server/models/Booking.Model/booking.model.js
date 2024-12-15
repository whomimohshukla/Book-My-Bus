
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },
    seats: [
      {
        seatNumber: String,
        price: Number,
      },
    ],
    passengers: [
      {
        name: {
          type: String,
          required: true,
        },
        age: {
          type: Number,
          required: true,
        },
        gender: {
          type: String,
          enum: ["male", "female", "other"],
          required: true,
        },
        seatNumber: String,
      },
    ],
    contactDetails: {
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    cancellationDetails: {
      cancelledAt: Date,
      reason: String,
      refundAmount: Number,
      refundStatus: {
        type: String,
        enum: ["pending", "processed", "completed"],
        default: "pending",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
