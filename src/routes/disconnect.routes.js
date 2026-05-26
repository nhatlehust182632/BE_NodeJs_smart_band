const express = require('express');
const router = express.Router();
const disconnectController = require('../controllers/disconnect.controller');

// POST /api/disconnect/saveAlert
// Input: body { user_id, user_device_id, last_seen_at?, message?, status? }
router.post('/saveAlert', disconnectController.saveDisconnectAlertController);

// GET /api/disconnect/countToday?id=<userId>
// Input: query { id: <userId> }
router.get('/countToday', disconnectController.getDisconnectAlertCountTodayController);

module.exports = router;
