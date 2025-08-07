const express = require("express");
const router = express.Router();
const routeController = require("../../controllers/BusTravelRoute.controller/busTravelRoute.controller");
const { auth, admin } = require("../../middleware/User.Auth.Middleware");
// Define routes
router.post("/Travelroutes", routeController.createRoute);
router.get("/Travelroutes", routeController.getAllRoutes);
router.get("/Travelroutes/:id", routeController.getRouteById);
router.put("/Travelroutes/:id", routeController.updateRoute);
router.delete("/Travelroutes/:id", routeController.deleteRoute);

module.exports = router;
