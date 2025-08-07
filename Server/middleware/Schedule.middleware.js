const Schedule = require("../models/Schedule.model/schedule.model");

const validateSchedule = async (req, res, next) => {
  try {
    const scheduleId = req.body.scheduleId || req.query.scheduleId;

    if (!scheduleId) {
      return res.status(400).json({ message: "Schedule ID is required." });
    }

    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      return res
        .status(404)
        .json({ message: "Invalid Schedule ID. Schedule not found." });
    }

    // Attach schedule data to the request object for further processing
    req.schedule = schedule;

    next();
  } catch (error) {
    console.error("Error validating schedule ID:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error during schedule validation." });
  }
};

module.exports = validateSchedule;
