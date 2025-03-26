const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post('/create' , userController.create);
router.post('/login' , userController.login);
router.post('/list' , userController.list);
router.post('/update' , userController.update);
router.post('/all' , userController.all);
router.post('/getWorkers' , userController.getWorkers);
router.post('/checkToken' , userController.checkToken);

module.exports = router;