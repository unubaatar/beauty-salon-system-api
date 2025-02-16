const express = require('express');
const router = express.Router();
const scheduleControllers = require("../controllers/schedule.controller");

router.post("/create" , scheduleControllers.create);
router.post("/list" , scheduleControllers.list);
router.post("/getScheduleByWeek" , scheduleControllers.getScheduleByWeek);
router.post("/delete" , scheduleControllers.delete);
router.post("/getByDate" , scheduleControllers.getByDate);


module.exports = router;