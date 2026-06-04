const express = require('express');
const router = express.Router();
const monitorController = require('../controllers/monitor.controller');

router.get('/getListMonitor', monitorController.selectMonitorList);
router.get('/getMonitorIdDetail', monitorController.selectMonitorId);
router.get('/following', monitorController.getFollowingController);
router.get('/followers', monitorController.getFollowersController);
router.get('/pending-requests', monitorController.getPendingRequestsController);

router.post('/approve-request', monitorController.approveRequestController);
router.post('/reject-request', monitorController.rejectRequestController);
router.post('/request-by-phone', monitorController.sendFollowRequestByPhoneController);
router.post('/cancel-monitoring', monitorController.cancelMonitoringController);
router.post('/cancel-follower', monitorController.cancelFollowerController);

module.exports = router;