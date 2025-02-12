const express = require('express');
const router = express.Router();
const timeReserveController = require("../controllers/timeReserve.controller");

router.post("/create" , timeReserveController.create);

module.exports = router;