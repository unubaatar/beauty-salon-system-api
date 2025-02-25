const express = require('express');
const router = express.Router();
const serviceVariantControllers = require("../controllers/serviceVariant.controller");

router.post("/create" , serviceVariantControllers.create);
router.post("/update" , serviceVariantControllers.update);
router.post("/getByService" , serviceVariantControllers.getByService);

module.exports  = router;