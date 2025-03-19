const express = require('express');
const router = express.Router();
const productVariantControllers = require("../controllers/productVariant.controller");

router.post("/create" , productVariantControllers.create);
router.post("/update" , productVariantControllers.update);

module.exports = router;