const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema({
  busNumber: { type: String, required: true },
  busName: { type: String, required: true },
  operatorId: { type: mongoose.Schema.Types.ObjectId, ref: "Operator" },
  type: {
    type: String,
    enum: ["AC", "Non-AC", "Sleeper", "Semi-Sleeper"],
    required: true,
  },
  totalSeats: { type: Number, required: true },
  amenities: [
    {
      name: { type: String },
      icon: { type: String },
      description: { type: String },
    },
  ],
  seatLayout: {
    rows: { type: Number, required: true },
    columns: { type: Number, required: true },
    seats: [
      {
        seatNumber: { type: String },
        type: { type: String, enum: ["Window", "Aisle", "Sleeper"] },
        deck: { type: String, enum: ["Lower", "Upper"] },
        isAvailable: { type: Boolean, default: true },
        price: { type: Number },
      },
    ],
  },
});

module.exports = mongoose.model("Bus", BusSchema);
