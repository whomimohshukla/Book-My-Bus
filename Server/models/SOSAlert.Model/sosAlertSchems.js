const mongoose = require("mongoose");

const sosAlertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // busId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Bus",
    //   required: true,
    // },
    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active",
    },
    description: {
      type: String,
    },
    emergencyType: {
      type: String,
      enum: ["medical", "security", "accident", "other"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SOSAlert", sosAlertSchema);
