const express = require('express');
const router = express.Router();
const customerControllers = require("../controllers/customer.controller");

router.post('/create' , customerControllers.create);
router.post('/login' , customerControllers.login);
router.post('/getById' , customerControllers.getById);

module.exports = router;