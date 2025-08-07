const Bus = require("../../models/Bus.Models/Bus");

// POST /api/buses – Add a bus
exports.addBus = async (req, res) => {
  try {
    const { busNumber, busName, operatorId, type, totalSeats, amenities, seatLayout } = req.body;

    // Validate required fields
    if (!busNumber || !busName || !type || !totalSeats) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    // Check for duplicates manually (optional if unique index is set)
    const existingBus = await Bus.findOne({ busNumber });
    if (existingBus) {
      return res.status(400).json({ error: "Bus with this number already exists." });
    }

    // Create the new bus
    const bus = new Bus({
      busNumber,
      busName,
      operatorId,
      type,
      totalSeats,
      amenities,
      seatLayout,
    });

    await bus.save();

    res.status(201).json({
      message: "Bus created successfully",
      data: bus,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Duplicate entry detected. Bus with this number already exists.",
      });
    }
    console.error("Error creating bus:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// GET /api/buses – List all buses
exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().populate("operatorId"); // Populate operator details if needed
    // const buses = await Bus.find(); // Populate operator details if needed
    res.status(200).json({
      message: "Buses fetched successfully",
      data: buses,
    });
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/buses/:id – Get bus details
exports.getBusById = async (req, res) => {
  try {
    const { id } = req.params;
    const bus = await Bus.findById(id).populate("operatorId"); // Populate operator details if needed
    if (!bus) return res.status(404).json({ error: "Bus not found" });
    res.status(200).json({
      message: "Bus fetched successfully",
      data: bus,
    });
  } catch (error) {
    console.error("Error fetching bus:", error);
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/buses/:id – Update bus details
exports.updateBus = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBus = await Bus.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedBus) return res.status(404).json({ error: "Bus not found" });
    res.status(200).json({
      message: "Bus updated successfully",
      data: updatedBus,
    });
  } catch (error) {
    console.error("Error updating bus:", error);
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/buses/:id – Remove bus
exports.deleteBus = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBus = await Bus.findByIdAndDelete(id);
    if (!deletedBus) return res.status(404).json({ error: "Bus not found" });
    res.status(200).json({ message: "Bus deleted successfully" });
  } catch (error) {
    console.error("Error deleting bus:", error);
    res.status(500).json({ error: error.message });
  }
};
