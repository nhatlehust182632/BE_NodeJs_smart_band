const util = require('util');
const deviceRepository = require('../repositories/device.repository');

const getDeviceId = util.promisify(deviceRepository.getDeviceId);
const postSaveDevices = util.promisify(deviceRepository.postSaveDevices);
const postSaveDevicesWithUser = util.promisify(deviceRepository.postSaveDevicesWithUser);
const getDevicesInfo = util.promisify(deviceRepository.getDevicesInfo);
const getDevicesInfoExistCheckById = util.promisify(deviceRepository.getDevicesInfoExistCheckById);
const saveBatteryLogRepo = util.promisify(deviceRepository.saveBatteryLog);
const disconnectUserActiveByUserRepo = util.promisify(deviceRepository.disconnectUserActiveByUser);
const getUserActiveByUserRepo = util.promisify(deviceRepository.getUserActiveByUser);
const insertUserActiveRepo = util.promisify(deviceRepository.insertUserActive);
const updateUserActiveByUserRepo = util.promisify(deviceRepository.updateUserActiveByUser);

const getProfileInfo = (data, callback) => {
  getDevicesInfo(data, callback);
};

const getDevicesInfoExistCheck = (data, callback) => {
  deviceRepository.getDevicesInfoExistCheck(data, callback);
};

const syncActiveDeviceConnection = async ({ userId, deviceId, macAddress }) => {
  const activeRows = await getUserActiveByUserRepo({ user_id: userId });

  if (activeRows && activeRows.length > 0) {
    await updateUserActiveByUserRepo({
      user_id: userId,
      device_id: deviceId,
      mac_address: macAddress,
    });
    return;
  }

  await insertUserActiveRepo({
    user_id: userId,
    device_id: deviceId,
    mac_address: macAddress,
  });
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
    await syncActiveDeviceConnection({
      userId,
      deviceId,
      macAddress: idDevices,
    });
    return existingUserDevice[0];
  }

  const result = await postSaveDevicesWithUser({
    idDevices: deviceId,
    userId: userId
  });

  await syncActiveDeviceConnection({
    userId,
    deviceId,
    macAddress: idDevices,
  });

  return {
    id: result.insertId,
    device_id: deviceId,
    user_id: userId,
    pairing_status: 1
  };
};



const disconnectActiveDeviceService = async ({ user_id }) => {
  const result = await disconnectUserActiveByUserRepo({ user_id });

  return {
    user_id,
    affectedRows: result?.affectedRows ?? 0,
    disconnected: true,
  };
};

const saveBatteryLogService = async ({ user_id, user_device_id, battery_percent, is_charging }) => {
  const result = await saveBatteryLogRepo({
    user_id,
    user_device_id,
    battery_percent,
    is_charging: is_charging ? 1 : 0,
  });

  if (!result || result.affectedRows === 0) {
    return null;
  }

  return {
    user_id,
    user_device_id,
    battery_percent,
    is_charging: is_charging ? 1 : 0,
    saved: true,
  };
};

module.exports = {
  getProfileInfo,
  getDevicesInfoExistCheck,
  saveDeviceWithUserService,
  disconnectActiveDeviceService,
  saveBatteryLogService
};