const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const auth = require("../middleware/auth");

router.post("/create", auth, productController.create);
router.post("/list", productController.list);
router.post("/update", auth, productController.update);
router.post("/getById", productController.getById);
router.post("/getByCategory", productController.getByCategory);
router.post("/getLatest", productController.getLatest);

module.exports = router;
