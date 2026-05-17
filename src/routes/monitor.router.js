const express = require('express');
const router = express.Router();
const monitorController = require('../controllers/monitor.controller');

router.get('/getListMonitor', monitorController.selectMonitorList);
router.get('/getMonitorIdDetail', monitorController.selectMonitorId);

module.exports = router;