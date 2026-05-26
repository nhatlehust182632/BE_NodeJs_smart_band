const express = require('express');
const stepController = require('../controllers/step.controller');

const router = express.Router();

// POST - Save or update step data for a date
router.post('/', stepController.saveStepData);

// GET - Get step data for specific date
router.get('/data', stepController.getStepData);

// GET - Get step history for last N days
router.get('/history', stepController.getStepHistory);

// PUT - Update step data
router.put('/', stepController.updateStepData);

module.exports = router;
