const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensor.controller');
const userController = require('../controllers/user.controller');

router.post('/register', userController.creatUser);
router.get('/login', userController.loginUser);
router.get('/selectInfo', userController.getInfoUser);
router.get('/getInfoEdit', userController.getInfoUserEdit);
router.post('/updateInfo', userController.postInfoUpdate);

module.exports = router;