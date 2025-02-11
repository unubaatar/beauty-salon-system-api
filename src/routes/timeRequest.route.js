const express = require('express');
const router = express.Router();
const timeRequestController = require("../controllers/timeRequest.controller");

router.post("/reserve" , timeRequestController.reserve);

module.exports = router;