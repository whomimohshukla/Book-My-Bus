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
    if (updated.status === "ARRIVED_DESTINATION") {
      io.emit("DESTINATION_NOTICE", {
        busId: updated.busId,
        time: new Date(updated.updatedAt).toISOString(),
      });
    } else if (updated.status === "ARRIVING_SOON") {
      io.emit("ARRIVAL_NOTICE", {
        busId: updated.busId,
        stopName: req.body.nextStop,
        time: req.body.eta,
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
    const doc = await LiveBusTracking.findOne({ busId: req.params.busId });
    if (!doc) return res.status(404).json({ message: "Not found" });
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
