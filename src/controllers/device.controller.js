const deviceService = require('../services/device.service');

const getDeviceInfo = (req, res) => {
  const { id } = req.query;
  if (!id ) {
    return res.status(400).json({
      success: false,
      message: 'Thieu du lieu',
      body: req.body
    });
  }

  deviceService.getProfileInfo(
    { id},
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

module.exports = {
  getDeviceInfo
};