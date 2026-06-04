const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device.controller');

/*
  Device API (/api/device)

  1) GET /api/device/getDeviceByUser
      - Query: { id: <userId> }
      - Returns: 200/201 { success, message, data: <device info> }
      - Purpose: Lấy thông tin thiết bị (first row) cho user

  2) GET /api/device/checkDeviceExist
      - Query: { idDevices: <device identifier>, userId: <userId> }
      - Returns: 200/201 { success, message, data: <exist row or null> }
      - Purpose: Kiểm tra device / quan hệ user_devices

  3) POST /api/device/saveDevicesWithUser
      - Body: { idDevices, nameDevice?, userId }
      - Returns: 201 { success, message, data: <user_device object> }
      - Purpose: Nếu devices chưa tồn tại -> tạo với devices.device_id = idDevices; id trong bảng tự tăng; tạo liên kết user_devices nếu chưa có

  Notes:
  - Một số endpoint hiện trả 201 cho GET (có thể đổi sang 200 nếu muốn theo chuẩn REST)
  - Các lỗi trả 400 khi thiếu tham số, 500 khi lỗi DB
*/

router.get('/getDeviceByUser', deviceController.getDeviceInfo);
router.get('/checkDeviceExist', deviceController.checkDeviceExist);
router.post('/saveDevicesWithUser', deviceController.saveDevicesWithUserController);
router.post('/saveBatteryLog', deviceController.saveBatteryLogController);
router.post('/disconnectActiveDevice', deviceController.disconnectActiveDeviceController);

module.exports = router;