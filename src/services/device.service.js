const util = require('util');
const deviceRepository = require('../repositories/device.repository');

const getDeviceId = util.promisify(deviceRepository.getDeviceId);
const postSaveDevices = util.promisify(deviceRepository.postSaveDevices);
const postSaveDevicesWithUser = util.promisify(deviceRepository.postSaveDevicesWithUser);
const getDevicesInfo = util.promisify(deviceRepository.getDevicesInfo);
const getDevicesInfoExistCheckById = util.promisify(deviceRepository.getDevicesInfoExistCheckById);

const getProfileInfo = (data, callback) => {
  getDevicesInfo(data, callback);
};

const getDevicesInfoExistCheck = (data, callback) => {
  deviceRepository.getDevicesInfoExistCheck(data, callback);
};

const saveDeviceWithUserService = async ({ idDevices, nameDevice, userId }) => {
  // Kiểm tra device đã tồn tại chưa
  let existingDevice = await getDeviceId({ idDevices });

  if (!existingDevice || existingDevice.length === 0) {
    // Nếu chưa tồn tại thì lưu device mới
    await postSaveDevices({
      idDevices,
      nameDevice
    });
    // Lấy lại id trong bảng devices
    existingDevice = await getDeviceId({ idDevices });
  }
  if (!existingDevice || existingDevice.length === 0) {
    throw new Error('Không tìm thấy thiết bị sau khi lưu');
  }
  const deviceId = existingDevice[0].id;
  // kiem tra device da duoc luu voi user chua
  const existingUserDevice = await getDevicesInfoExistCheckById({
    idDevices: deviceId,
    userId
  });
  if (existingUserDevice && existingUserDevice.length > 0) {
    return existingUserDevice[0];
  }

  const result = await postSaveDevicesWithUser({
    idDevices: deviceId,
    userId: userId
  });

  return {
    id: result.insertId,
    device_id: deviceId,
    user_id: userId,
    pairing_status: 1
  };
};

module.exports = {
  getProfileInfo,
  getDevicesInfoExistCheck,
  saveDeviceWithUserService
};