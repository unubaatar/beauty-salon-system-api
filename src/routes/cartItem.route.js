const express = require('express');
const router = express.Router();
const cartItemControllers = require("../controllers/cartItem.controller");

router.post("/create" , cartItemControllers.create);
router.post("/update" , cartItemControllers.update);
router.post("/getByCustomer" , cartItemControllers.getByCustomer);
router.post("/delete" , cartItemControllers.delete);

module.exports = router;