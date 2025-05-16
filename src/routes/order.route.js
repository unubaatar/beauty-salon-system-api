const express = require("express");
const router = express.Router();
const orderControllers = require("../controllers/order.controller");
const auth = require("../middleware/auth");

router.post("/create", orderControllers.create);
router.post("/list", orderControllers.list);
router.post("/update", auth, orderControllers.update);
router.post("/getById", orderControllers.getById);
router.post("/getByCustomer", orderControllers.getByCustomer);
router.post("/getProductReport", auth, orderControllers.getProductReport);

module.exports = router;
