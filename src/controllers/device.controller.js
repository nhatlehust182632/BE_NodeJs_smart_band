const deviceService = require('../services/device.service');

const getDeviceInfo = (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Thieu du lieu',
      body: req.body
    });
  }

  deviceService.getProfileInfo(
    { id },
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Lấy dữ liệu'
        });
      }

      res.status(201).json({
        success: true,
        message: 'Lấy dữ liệu thành công',
        data: result[0]
      });
    }
  );
};

const checkDeviceExist = (req, res) => {
  const { idDevices, userId } = req.query;
  if (!idDevices || !userId) {
    return res.status(400).json({
      success: false,
      message: 'Thieu du lieu',
      body: req.body
    });
  }

  deviceService.getDevicesInfoExistCheck(
    { idDevices, userId },
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Lấy dữ liệu thất bại'
        });
      }
      res.status(201).json({
        success: true,
        message: 'Lấy dữ liệu thành công',
        data: result[0]
      });
    }
  );
};

const saveDevicesWithUserController = async (req, res) => {
  try {
    const { idDevices, nameDevice, userId } = req.body;
    if (!idDevices || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu dữ liệu',
        body: req.body
      });
    }

    const saved = await deviceService.saveDeviceWithUserService({
      idDevices,
      nameDevice,
      userId
    });

    return res.status(201).json({
      success: true,
      message: 'Lưu dữ liệu thành công',
      data: saved
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lưu dữ liệu thất bại: ' + (error.message || error)
    });
  }
};

const saveHeartRateAndActiveDevice = async (req, res) => {
  try {
    const { idUser, idDevices, bpm, mac_address } = req.body;
    if (!idUser || bpm == null) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu dữ liệu',
        body: req.body
      });
    }

    const heartRateService = require('../services/heartRate.service');
    const result = await heartRateService.saveHeartRateAndUpdateActiveDeviceService({ idUser, idDevices, bpm, mac_address });

    return res.status(200).json({
      success: true,
      message: 'Lưu nhịp tim và cập nhật active device thành công',
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lưu dữ liệu thất bại: ' + (error.message || error)
    });
  }
};



const disconnectActiveDeviceController = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu dữ liệu',
        body: req.body
      });
    }

    const result = await deviceService.disconnectActiveDeviceService({ user_id });

    return res.status(200).json({
      success: true,
      message: 'Đã ngắt trạng thái kết nối thiết bị',
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Ngắt trạng thái kết nối thiết bị thất bại: ' + (error.message || error),
      error: error.message
    });
  }
};

const saveBatteryLogController = async (req, res) => {
  try {
    const { user_id, user_device_id, battery_percent, is_charging } = req.body;

    if (!user_id || !user_device_id || battery_percent == null) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu dữ liệu',
        body: req.body
      });
    }

    const result = await deviceService.saveBatteryLogService({
      user_id,
      user_device_id,
      battery_percent,
      is_charging: is_charging ? 1 : 0,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user_device phù hợp để lưu pin'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lưu pin thiết bị thành công',
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lưu pin thiết bị thất bại: ' + (error.message || error),
      error: error.message
    });
  }
};

module.exports = {
  getDeviceInfo,
  checkDeviceExist,
  saveDevicesWithUserController,
  disconnectActiveDeviceController,
  saveBatteryLogController,
  saveHeartRateAndActiveDevice
};