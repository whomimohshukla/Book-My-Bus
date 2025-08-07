const express = require("express");
const router = express.Router();
const { auth } = require("../../middleware/User.Auth.Middleware");
const enhancedPassengerController = require("../../controllers/EnhancePassenger.Controller/enhancedPassenger.controller");

// Basic Profile Routes
router.post("/profile", auth, enhancedPassengerController.createProfile);
router.get("/profile", auth, enhancedPassengerController.getProfile);
router.put("/profile", auth, enhancedPassengerController.updateProfile);

// Saved Travelers Routes
router.post("/travelers", auth, enhancedPassengerController.addSavedTraveler);
router.put("/travelers/:travelerId", auth, enhancedPassengerController.updateSavedTraveler);
router.delete("/travelers/:travelerId", auth, enhancedPassengerController.deleteSavedTraveler);

// Frequent Routes
router.post("/frequent-routes", auth, enhancedPassengerController.addFrequentRoute);
router.get("/frequent-routes", auth, enhancedPassengerController.getFrequentRoutes);
router.put("/frequent-routes/:routeId", auth, enhancedPassengerController.updateFrequentRoute);
router.delete("/frequent-routes/:routeId", auth, enhancedPassengerController.deleteFrequentRoute);

// Loyalty Program Routes
router.post("/loyalty/points", auth, enhancedPassengerController.updateLoyaltyPoints);

// Stats Routes
router.get("/stats", auth, enhancedPassengerController.getPassengerStats);

module.exports = router;
