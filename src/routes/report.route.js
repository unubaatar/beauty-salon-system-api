const express = require("express");
const router = express.Router();
const reportControllers = require("../controllers/report.controller");
const auth = require("../middleware/auth");

router.post("/getTodayData", auth, reportControllers.getTodayData);
router.post("/getLastTenDaysData", auth, reportControllers.getLastTenDaysData);
router.post(
  "/getTotalMonthIncome",
  auth,
  reportControllers.getTotalMonthIncome
);

module.exports = router;
