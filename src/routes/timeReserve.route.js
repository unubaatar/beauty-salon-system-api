const express = require('express');
const router = express.Router();
const timeReserveController = require("../controllers/timeReserve.controller");

router.post("/create" , timeReserveController.create);
router.post("/getById" , timeReserveController.getById);
router.post("/getByCustomer" , timeReserveController.getByCustomer);
router.post("/update" , timeReserveController.update);
router.post("/getByUserReport" , timeReserveController.getByUserReport);

module.exports = router;