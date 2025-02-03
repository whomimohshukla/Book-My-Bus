const express = require("express");
const router = express.Router();
const emergencyRoutes = require("../../controllers/Emergency.SOS.Controller/emergencSos.Controller");

// SOS Alert routes
router.post("/sos", emergencyRoutes.triggerSOS);

// Emergency Contacts routes
router.get("/contacts/:userId", emergencyRoutes.getEmergencyContacts);
router.put("/contacts/:userId", emergencyRoutes.updateEmergencyContacts);
router.post("/contacts/:userId", emergencyRoutes.addEmergencyContact);
router.delete("/contacts/:userId/:contactId", emergencyRoutes.deleteEmergencyContact);

// Hospital routes
router.get("/nearby-hospitals", emergencyRoutes.getNearbyHospitals);

module.exports = router;
