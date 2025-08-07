const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/BusLiveTracking.controller/busLiveTracking.controller");

// POST /api/live-tracking  – create tracking doc
router.post("/", ctrl.createLiveTracking);

// PATCH /api/live-tracking/:id – update tracking (location, status, eta)
router.patch("/:id", ctrl.updateLiveTracking);

// GET /api/live-tracking/bus/:busId – fetch current tracking info for a bus
router.get("/bus/:busId", ctrl.getByBusId);

// DELETE /api/live-tracking/:id – delete tracking doc (end trip)
router.delete("/:id", ctrl.deleteLiveTracking);

module.exports = router;
