// routes/newsletter.routes.js
const express = require("express");
const router = express.Router();
const { subscribe } = require("../../controllers/Newsletter.controller/newsletter.controller");

router.post("/subscribe", subscribe);

module.exports = router;
