const express = require('express');
const router = express.Router();
const orderControllers = require("../controllers/order.controller");

router.post("/create" , orderControllers.create);
router.post("/list" , orderControllers.list);
router.post("/update" , orderControllers.update);
router.post("/getById" , orderControllers.getById);
router.post('/getByCustomer' , orderControllers.getByCustomer);
router.post("/update" , orderControllers.update);
router.post("/getProductReport" , orderControllers.getProductReport)

module.exports = router;