const express = require('express');
const router = express.Router();
const heartRateController = require('../controllers/heartRate.controller');

router.get('/getInfo', heartRateController.getInfoHeartRateByUser);
router.get('/ChartTime', heartRateController.getInfoHeartRateByTimes);
router.get('/history', heartRateController.getInfoHeartRateHistory);
router.post('/saveHeartRateData', heartRateController.saveHeartRateDataByDevices);

module.exports = router;