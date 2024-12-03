const mongoose = require("mongoose");


// this is city model 
const CitySchema = new mongoose.Schema({
  name: { type: String, required: true,unique: true }, // Name of the city
  state: { type: String, required: true }, // State in which the city is located
  country: { type: String, default: "India" }, // Country (default set to 'India')
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  isPopular: { type: Boolean, default: false }, // Mark if the city is a popular travel hub
  createdAt: { type: Date, default: Date.now }, // Timestamp when the city was added
  updatedAt: { type: Date, default: Date.now }, // Timestamp for the last update
});

// Add an index for geospatial queries
CitySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("City", CitySchema);
