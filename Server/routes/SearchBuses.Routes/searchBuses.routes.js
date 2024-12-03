const express = require("express");

const routes = express.Router();

// export the schedule route controller

const searchBuses = require("../../controllers/searchBuses.controller/searchBuses.Controller");

routes.get("/buses/search",searchBuses.searchBuses)
module.exports = routes;
