const LiveBusTracking = require("../../models/Bus.Models/BusLiveTracking.Model");
const socket = require("../../socket");

/**
 * Create a new live tracking document when a bus trip starts.
 */
exports.createLiveTracking = async (req, res, next) => {
  try {
    const doc = await LiveBusTracking.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

/**
 * Update the bus's current location, status, or ETA.
 * Emits arrival / destination notices via Socket.IO.
 */
exports.updateLiveTracking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await LiveBusTracking.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Not found" });

    // Emit real-time notifications based on status or ETA flags sent by the driver app / GPS service.
    const io = socket.getIo();
    // Determine room name (clients should join `bus-<busId>`)
    const room = `bus-${updated.busId}`;

    // Location update event (for live map)
    if (req.body.currentLocation && req.body.currentLocation.coordinates) {
      io.to(room).emit("LOCATION_UPDATE", {
        busId: updated.busId,
        coordinates: req.body.currentLocation.coordinates,
        speed: req.body.speed || null,
      });
      // Fallback global emit in case client didn't join room
      io.emit("LOCATION_UPDATE", {
        busId: updated.busId,
        coordinates: req.body.currentLocation.coordinates,
        speed: req.body.speed || null,
      });
    }

    if (updated.status === "ARRIVED_DESTINATION") {
      io.emit("DESTINATION_NOTICE", {
        busId: updated.busId,
        time: new Date(updated.updatedAt).toISOString(),
      });
    } else if (updated.status === "ARRIVING_SOON") {
      io.to(room).emit("ARRIVAL_NOTICE", {
        busId: updated.busId,
        stopName: req.body.nextStop,
        eta: req.body.eta,
      });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * Get a live tracking document by busId. Useful for passengers loading the tracking screen.
 */
exports.getByBusId = async (req, res, next) => {
  try {
    let doc = await LiveBusTracking.findOne({ busId: req.params.busId });
    if (!doc) {
      // Auto-create a stub tracking document so the frontend can render immediately.
      // TODO: Replace hard-coded defaults with real data (e.g. pull totalSeats from BusDetails).
      doc = await LiveBusTracking.create({
        busId: req.params.busId,
        currentLocation: { type: "Point", coordinates: [0, 0] },
        status: "ON_TIME",
        totalSeats: 40,
      });
    }
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a live tracking document at the end of a trip.
 */
exports.deleteLiveTracking = async (req, res, next) => {
  try {
    await LiveBusTracking.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
