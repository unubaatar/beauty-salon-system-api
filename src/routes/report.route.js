const express = require('express');
const router = express.Router();
const reportControllers = require("../controllers/report.controller");


router.post("/getTodayData" , reportControllers.getTodayData)
router.post("/getLastTenDaysData" , reportControllers.getLastTenDaysData);
router.post("/getTotalMonthIncome" , reportControllers.getTotalMonthIncome);

module.exports = router;