const express = require("express");
const router = express.Router();
const productVariantControllers = require("../controllers/productVariant.controller");
const auth = require("../middleware/auth");

router.post("/create", auth, productVariantControllers.create);
router.post("/update", auth, productVariantControllers.update);

module.exports = router;
