const express = require('express');
const router = express.Router();
const productOptionControllers = require("../controllers/productOption.controller");

router.post("/create" , productOptionControllers.create);
router.post("/update" , productOptionControllers.update);
router.post("/all" , productOptionControllers.all);

module.exports = router;