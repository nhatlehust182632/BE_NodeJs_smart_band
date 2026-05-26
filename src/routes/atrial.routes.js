const express = require('express');
const router = express.Router();
const atrialController = require('../controllers/atrial.controller');

// POST /api/atrial/saveAlert
// Input: body { user_id, threshold_value, message? }
router.post('/saveAlert', atrialController.saveAtrialAlertController);

// GET /api/atrial/count?idUser=<userId>&date=YYYY-MM-DD
// Input: query { idUser: <userId>, date?: YYYY-MM-DD } (mac dinh la ngay hien tai)
router.get('/count', atrialController.getAtrialAlertCountController);

module.exports = router;
