const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');

router.post('/placeNow', locationController.insertLocation);
router.get('/getListHistoryUser', locationController.getHistoryLocationController);
router.get('/getTopLocation', locationController.getTopLocationController);

module.exports = router;