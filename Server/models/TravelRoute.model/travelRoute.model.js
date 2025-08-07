const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema({
  // starting point for routes
  source: {
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
    name: { type: String, required: true },
    state: { type: String },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
  },
  // destination point for routes
  destination: {
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
    name: { type: String, required: true },
    state: { type: String },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
  },
  // estimated distance and duration for the route
  distance: { type: Number, required: true }, // Distance in kilometers
  pricePerKm: { type: Number, required: true }, // Price per kilometer

  viaStops: [
    {
      cityId: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
      name: { type: String },
      arrivalTime: { type: String },
      departureTime: { type: String },
      stopDuration: { type: Number },
    },
  ],
});

module.exports = mongoose.model("Route", RouteSchema);
