const express = require("express");
const router = express.Router();
const {
  auth,
  isPassenger,
  admin,
} = require("../../middleware/User.Auth.Middleware");
const BusController = require("../../controllers/Bus.controller/Bus.Maker");
// dummmy routes for checking

router.post("/admin-route", auth, admin, (req, res) => {
  res.send("Admin access granted");
});

router.post("/passenger-route", auth, isPassenger, (req, res) => {
  res.send("Passenger access granted");
});

// Route to create a new bus

router.post("/buses", BusController.addBus);

// Route to get all buses
router.get("/buses",  BusController.getAllBuses);
// router.get("/buses", BusController.getAllBuses);

// Route to get a bus by ID
// router.get("/buses/:id", auth, admin, BusController.getBusById);
router.get("/buses/:id", BusController.getBusById);

// Route to update a bus by ID
// router.put("/buses/:id", auth, admin, BusController.updateBus);
router.put("/buses/:id",BusController.updateBus);

// Route to delete a bus by ID
// router.delete("/buses/:id", auth, admin, BusController.deleteBus);
router.delete("/buses/:id", BusController.deleteBus);

module.exports = router;
