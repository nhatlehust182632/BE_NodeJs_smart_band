const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensor.controller');

router.post('/device-status-packet', sensorController.receiveDeviceStatusPacket);
router.post('/', sensorController.createSensorData);
router.get('/', sensorController.getAllSensors);
router.get('/latest', sensorController.getLatestSensor);

module.exports = router;