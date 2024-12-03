const express = require("express");
const { auth, admin } = require("../../middleware/User.Auth.Middleware");

const routes = express.Router();

// export the schedule route controller

const operatorRoutes = require("../../controllers/Operator.controller/operator.controller");

routes.post("/operator", operatorRoutes.createOperator);
routes.get("/operator", operatorRoutes.getAllOperators);
routes.get("/operator/:id", operatorRoutes.getOperatorById);
routes.put("/operator/:id", operatorRoutes.updateOperator);
routes.delete("/operator/:id", operatorRoutes.deleteOperator);

module.exports = routes;
