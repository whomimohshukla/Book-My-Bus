const mongoose = require("mongoose");

const emergencyContactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contacts: [
      {
        name: {
          type: String,
          required: true,
        },
        relationship: {
          type: String,
          required: true,
        },
        phoneNumber: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: false,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmergencyContact", emergencyContactSchema);
