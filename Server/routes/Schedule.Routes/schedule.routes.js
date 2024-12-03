const express = require("express");

const routes = express.Router();

// export the schedule route controller

const scheduleRoutes = require("../../controllers/Schedule.controller/schedule.controller");

routes.post("/schedule", scheduleRoutes.createSchedule);
routes.get("/schedule", scheduleRoutes.getSchedules);
routes.get("/schedule/:id", scheduleRoutes.getScheduleById);
routes.put("/schedule/:id", scheduleRoutes.updateSchedule);
routes.delete("/schedule/:id", scheduleRoutes.deleteSchedule);

module.exports = routes;
