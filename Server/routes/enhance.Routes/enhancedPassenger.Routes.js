const express = require("express");
const router = express.Router();
const { auth } = require("../../middleware/User.Auth.Middleware");
const enhancedPassengerController = require("../../controllers/EnhancePassenger.Controller/enhancedPassenger.controller");

// Basic Profile Routes
router.post("/profile", auth, enhancedPassengerController.createProfile);

router.get("/profile/:id", auth, enhancedPassengerController.getProfile);

router.put("/profile/:id", auth, enhancedPassengerController.updateProfile);

// Saved Travelers Routes
router.post(
  "/profile/:id/travelers",
  auth,
  enhancedPassengerController.addSavedTraveler
);

router.put(
  "/profile/:id/travelers/:travelerId",
  auth,
  enhancedPassengerController.updateSavedTraveler
);

router.delete(
  "/profile/:id/travelers/:travelerId",
  auth,
  enhancedPassengerController.deleteSavedTraveler
);

router.post(
  "/profile/:id/travelers/bulk-verify",
  auth,
  enhancedPassengerController.bulkUpdateTravelersVerification
);

// Loyalty Program Routes
router.post(
  "/profile/:id/loyalty/points",
  auth,
  enhancedPassengerController.updateLoyaltyPoints
);

// Preferences Routes
router.put(
  "/profile/:id/preferences",
  auth,
  enhancedPassengerController.updatePreferences
);

router.post(
  "/profile/:id/frequent-routes",
  auth,
  enhancedPassengerController.addFrequentRoute
);

// Emergency Contact Routes
router.put(
  "/profile/:id/emergency-contact",
  auth,
  enhancedPassengerController.updateEmergencyContact
);

// Analytics Routes
router.get(
  "/profile/:id/stats",
  auth,
  enhancedPassengerController.getPassengerStats
);

module.exports = router;
