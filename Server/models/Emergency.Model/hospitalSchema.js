const mongoose = require("mongoose");

// MongoDB Schema for local hospital database
const hospitalSchema = new mongoose.Schema({
  name: String,
  address: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  phone: String,
  emergency: Boolean,
});

hospitalSchema.index({ location: "2dsphere" });
const Hospital = mongoose.model("Hospital", hospitalSchema);

module.exports = Hospital;