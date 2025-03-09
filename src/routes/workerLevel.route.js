const express = require('express');
const router = express.Router();
const workerLevelControllers = require("../controllers/workerLevel.controller");

router.post("/create" , workerLevelControllers.create);
router.post("/update" , workerLevelControllers.update);
router.post("/all" , workerLevelControllers.all);

module.exports = router;