const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device.controller');

router.get('/getDeviceByUser', deviceController.getDeviceInfo);
router.get('/checkDeviceExist', deviceController.checkDeviceExist);
router.post('/saveDevicesWithUser', deviceController.saveDevicesWithUserController);

module.exports = router;