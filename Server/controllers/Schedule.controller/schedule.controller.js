const Schedule = require("../../models/Schedule.model/schedule.model");
const Booking = require("../../models/Booking.Model/booking.model");

//create a new Schedule
exports.createSchedule = async (req, res) => {
  try {
    const scheduleData = req.body;
    const schedule = new Schedule(scheduleData);

    await schedule.save();
    res
      .status(201)
      .json({ message: 'Schedule saved successfully"', data: schedule });
  } catch (error) {
    console.error("Error creating schedule:", error);
    res.status(400).json({ error: error.message });
  }
};

//get schedule
exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate("busId", "busName busNumber")
      .populate("routeId", "fromCity toCity");

    res.status(200).json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(400).json({ error: error.message });
  }
};

// get specific schedules
exports.getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findById(id)
      .populate("busId", "busName busNumber")
      .populate("routeId", "fromCity toCity");

    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    res.status(200).json(schedule);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(400).json({ error: error.message });
  }
};

// update specific schedule
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const schedule = await Schedule.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    res.status(200).json({
      message: "Schedule updated successfully",
      data: schedule,
    });
  } catch (error) {
    console.error("Error updating schedule:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get seat map for a schedule
exports.getSeatMap = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch bookings that still hold seats (pending or confirmed/completed)
    const bookings = await Booking.find({
      scheduleId: id,
      status: { $in: ["pending", "confirmed", "completed"] },
    }).select("seats passengers");

    const bookedSeats = [];
    bookings.forEach((booking) => {
      booking.seats.forEach((seatObj, idx) => {
        const seatNum = seatObj.seatNumber || seatObj.seat || seatObj; // fallback
        const passenger = booking.passengers[idx] || {};
        const gender = (passenger.gender || "male").toLowerCase();
        bookedSeats.push({
          seat: seatNum.toString(),
          status: gender === "female" ? "bookedFemale" : "bookedMale",
        });
      });
    });

    return res.json(bookedSeats);
  } catch (error) {
    console.error("Error fetching seat map:", error);
    res.status(500).json({ success: false, message: "Failed to fetch seat map" });
  }
};

// delete all schedules
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findByIdAndDelete(id);

    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    res.status(400).json({ error: error.message });
  }
};
