const express = require("express");
const router = express.Router();
const emergencyRoutes = require("../../controllers/Emergency.SOS.Controller/emergencSos.Controller");

router.post("/sos", emergencyRoutes.triggerSOS);
router.get("/contacts/:userId", emergencyRoutes.getEmergencyContacts);
router.put("/contacts/:userId", emergencyRoutes.updateEmergencyContacts);
router.get("/nearby-hospitals", emergencyRoutes.getNearbyHospitals);

module.exports = router;
