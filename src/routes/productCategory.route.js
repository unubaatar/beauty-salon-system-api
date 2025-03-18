const express = require('express');
const router = express.Router();
const productCategoryController = require("../controllers/productCategory.controller");

router.post("/create" ,  productCategoryController.create);
router.post("/all" ,  productCategoryController.all);
router.post("/update" ,  productCategoryController.update);

module.exports = router;