const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true,
  },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  availableSeats: { type: Number, required: true },
  fareDetails: {
    baseFare: { type: Number, required: true },
    tax: { type: Number, required: true },
    serviceFee: { type: Number, required: true },
  },
  status: {
    type: String,
    enum: ["Active", "Cancelled", "Completed"],
    default: "Active",
  },
});

module.exports = mongoose.model("Schedule", ScheduleSchema);
