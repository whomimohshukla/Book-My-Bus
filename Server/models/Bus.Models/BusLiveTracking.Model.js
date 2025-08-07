const mongoose = require("mongoose");

const liveBusTrackingSchema = new mongoose.Schema(
  {
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusDetails",
      required: true,
    },
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["ON_TIME", "DELAYED", "CANCELLED"],
      default: "ON_TIME",
    },
    estimatedArrivalTime: {
      type: Date,
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Create a 2dsphere index on the 'currentLocation' field for geospatial queries
liveBusTrackingSchema.index({ currentLocation: "2dsphere" });

const LiveBusTracking = mongoose.model(
  "LiveBusTracking",
  liveBusTrackingSchema
);
module.exports = LiveBusTracking;
