const express = require('express');
const router = express.Router();
const serviceControllers = require("../controllers/service.controller");

router.post("/create" , serviceControllers.create);
router.post("/update" , serviceControllers.update);
router.post("/list" , serviceControllers.list);
router.post("/all" , serviceControllers.all);
router.post("/getWorkerByService" , serviceControllers.getWorkerByService);
router.post("/getById" , serviceControllers.getById);

module.exports = router;