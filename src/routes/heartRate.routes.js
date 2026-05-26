const express = require('express');
const router = express.Router();
const heartRateController = require('../controllers/heartRate.controller');

// GET /api/heartRate/getInfo
// Input: query { id: <userId> }
// Output: { success, message, data: <user heart rate summary> }
// Yêu cầu: Lấy thống kê nhịp tim hiện tại từ bảng `user_health` cho user
router.get('/getInfo', heartRateController.getInfoHeartRateByUser);

// GET /api/heartRate/ChartTime?type=1H|6H|24H&id=<userId>
// Input: query { id: <userId>, type: '1H'|'6H'|'24H' }
// Output: { success, message, data: [<time bucket rows>] }
// Yêu cầu: Lấy dữ liệu nhịp tim theo khoảng thời gian bucket từ bảng `user_health`
router.get('/ChartTime', heartRateController.getInfoHeartRateByTimes);

// GET /api/heartRate/history
// Input: query { id: <userId> }
// Output: { success, message, data: [<history rows>] }
// Yêu cầu: Lấy lịch sử nhịp tim của user từ bảng `user_health`
router.get('/history', heartRateController.getInfoHeartRateHistory);

// POST /api/heartRate/saveHeartRateData
// Input: body { idUser: <userId>, idDevices: <user_device_id>, bpm: <heart rate> }
// Output: { success, message, data: <insert result> }
// Yêu cầu: Lưu nhịp tim mới vào bảng `user_health` qua user_device hiện có
router.post('/saveHeartRateData', heartRateController.saveHeartRateDataByDevices);

// POST /api/heartRate/saveHeartRateActive
// Input: body { idUser: <userId>, bpm: <heart rate>, idDevices?: <user_device_id>, mac_address: <device MAC address> }
// Output: { success, message, data: { user_device_id, device_id, saved: true } }
// Yêu cầu: Lưu nhịp tim và cập nhật hoặc tạo `user_active_devices`; nếu cần, tạo user_device mới
router.post('/saveHeartRateActive', heartRateController.saveHeartRateActive);

module.exports = router;