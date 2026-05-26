const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');

// POST /api/location/placeNow
// - Lưu vị trí hiện tại vào bảng `location_histories`
router.post('/placeNow', locationController.insertLocation);

// GET /api/location/getListHistoryUser
// - Lấy toàn bộ lịch sử vị trí của user theo bảng `location_histories`
router.get('/getListHistoryUser', locationController.getHistoryLocationController);

// GET /api/location/getTopLocation
// - Lấy 3 địa điểm được đến nhiều nhất theo bảng `location_histories`
router.get('/getTopLocation', locationController.getTopLocationController);

module.exports = router;