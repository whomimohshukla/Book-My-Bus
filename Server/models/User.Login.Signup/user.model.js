const mongoose = require("mongoose");

// user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Passenger"],
      default: "user",
    },
    passengerType: {
      type: String,
      enum: ["Adult", "Child", "Senior", "Student"], // Add passenger types here
      default: "Adult",
    },
    bookingHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    image: { type: String },
  },
  { timestamps: true }
);

// create user model
const User = mongoose.model("User", userSchema);

module.exports = User;
