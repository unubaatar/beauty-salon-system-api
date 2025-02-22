const express = require('express');
const router = express.Router();
const serviceCategoryControllers = require("../controllers/serviceCategory.controller");

router.post("/create" , serviceCategoryControllers.create);
router.post("/update" , serviceCategoryControllers.update);
router.post("/list" , serviceCategoryControllers.list);

module.exports = router;

