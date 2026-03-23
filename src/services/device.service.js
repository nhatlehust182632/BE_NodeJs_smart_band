const deviceRepository = require('../repositories/device.repository');

const getProfileInfo = (data, callback) => {
  deviceRepository.getDevicesInfo(data, callback);
};

module.exports = {
  getProfileInfo,
};