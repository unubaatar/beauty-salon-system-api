const express = require('express');
const router = express.Router();
const timeRequestController = require("../controllers/timeRequest.controller");

router.post("/getPossibleTimes" , timeRequestController.getPossibleTimes);

module.exports = router;