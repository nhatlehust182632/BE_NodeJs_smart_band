const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device.controller');

router.get('/getDeviceByUser', deviceController.getDeviceInfo);

module.exports = router;