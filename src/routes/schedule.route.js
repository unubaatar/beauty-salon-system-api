const express = require("express");
const router = express.Router();
const scheduleControllers = require("../controllers/schedule.controller");
const auth = require("../middleware/auth");

router.post("/create", auth, scheduleControllers.create);
router.post("/list", scheduleControllers.list);
router.post("/getScheduleByWeek", scheduleControllers.getScheduleByWeek);
router.post("/delete", auth, scheduleControllers.delete);
router.post("/getByDate", scheduleControllers.getByDate);

module.exports = router;
