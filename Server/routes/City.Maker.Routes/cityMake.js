const express = require("express");
const router = express.Router();
const cityController = require("../../controllers/City.controller/city.Controller");
const {
  auth,
  isPassenger,
  admin,
} = require("../../middleware/User.Auth.Middleware");
// router.post("/createCity", auth,admin, cityController.createCity); // Create city
router.post("/createCity", cityController.createCity); // Create city
// router.get("/getAllCities",auth,admin, cityController.getCities); // Get all cities
router.get("/getAllCities", cityController.getCities); // Get all cities
// router.get("/cityByName/:name",auth,admin, cityController.getCityByName); // Get city by ID
router.get("/cityByName/:id", cityController.getCityByName); // Get city by ID
// router.put("/:id",auth,admin, cityController.updateCity); // Update city
router.put("/:id", cityController.updateCity); // Update city
// router.delete("/:id",auth,admin, cityController.deleteCityById); // Delete city
router.delete("/:id", cityController.deleteCityById); // Delete city

module.exports = router;
