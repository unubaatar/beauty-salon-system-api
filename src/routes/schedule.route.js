const express = require('express');
const router = express.Router();
const scheduleControllers = require("../controllers/schedule.controller");

router.post("/create" , scheduleControllers.create);
router.post("/list" , scheduleControllers.list);
router.post("/getScheduleByWeek" , scheduleControllers.getScheduleByWeek);

module.exports = router;