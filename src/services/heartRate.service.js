const util = require('util');
const heartRateRepository = require('../repositories/heartRate.repository');
const deviceRepository = require('../repositories/device.repository');

const getHeartRateInfoService = async (data) => {
  const resultHeartRateNow = await heartRateRepository.getHeartRateInfoRepository(data);
  if (!resultHeartRateNow || resultHeartRateNow.length === 0) {
    return null;
  }
  return resultHeartRateNow[0];
};

const getHeartRateByTimeService = async (data) => {
  const resultHeartRateByTimes = await heartRateRepository.getHeartRateByTimeRepository(data);
  if (!resultHeartRateByTimes || resultHeartRateByTimes.length === 0) {
    return null;
  }
  return resultHeartRateByTimes;
};

const getHeartRateHistoryService = async (data) => {
  const resultHeartRateByTimes = await heartRateRepository.getHeartRateHistoryRepository(data);
  if (!resultHeartRateByTimes || resultHeartRateByTimes.length === 0) {
    return null;
  }
  return resultHeartRateByTimes;
};

const saveHeartRateDataService = async (data) => {
  const result = await heartRateRepository.saveHeartRateDataRepository(data);
  if (!result || result.affectedRows === 0) {
    return null;
  }
  return result;
};

const getUserDeviceByIdRepo = util.promisify(deviceRepository.getUserDeviceById);
const getIdUserDeviceByIdDeviceAndIdUserRepo = util.promisify(deviceRepository.getIdUserDeviceByIdDeviceAndIdUser);
const getUserActiveByUserRepo = util.promisify(deviceRepository.getUserActiveByUser);
const insertUserActiveRepo = util.promisify(deviceRepository.insertUserActive);
const updateUserActiveByUserRepo = util.promisify(deviceRepository.updateUserActiveByUser);

const resolveDeviceForActiveUpdate = async ({ idUser, idDevices }) => {
  if (!idDevices) {
    return { userDeviceId: null, deviceId: null };
  }

  // Ưu tiên hiểu idDevices là user_devices.id.
  const userDeviceRows = await getUserDeviceByIdRepo({ user_device_id: idDevices });
  if (userDeviceRows && userDeviceRows.length > 0 && String(userDeviceRows[0].user_id) === String(idUser)) {
    return {
      userDeviceId: userDeviceRows[0].id,
      deviceId: userDeviceRows[0].device_id,
    };
  }

  // Dự phòng: nếu FE cũ truyền devices.id thì tìm lại user_devices theo user_id + device_id.
  const byDeviceRows = await getIdUserDeviceByIdDeviceAndIdUserRepo({
    idDevices,
    userId: idUser,
  });

  if (byDeviceRows && byDeviceRows.length > 0) {
    return {
      userDeviceId: byDeviceRows[0].id,
      deviceId: byDeviceRows[0].device_id,
    };
  }

  return { userDeviceId: null, deviceId: null };
};

const saveHeartRateAndUpdateActiveDeviceService = async (data) => {
  // user_health hiện lưu theo users.id, không còn lưu theo user_devices.id.
  const { idUser, idDevices, bpm, mac_address } = data;

  if (!idUser || bpm == null) {
    throw new Error('Thiếu idUser hoặc bpm');
  }

  const saveResult = await heartRateRepository.saveHeartRateDataRepository({
    idUser,
    bpm,
  });

  if (!saveResult || saveResult.affectedRows === 0) {
    throw new Error('Lưu nhịp tim thất bại hoặc user không tồn tại/không active');
  }

  const { userDeviceId, deviceId } = await resolveDeviceForActiveUpdate({
    idUser,
    idDevices,
  });

  // Cập nhật user_active_devices chỉ là phụ. Không để lỗi device làm hỏng việc lưu user_health.
  if (deviceId) {
    const active = await getUserActiveByUserRepo({ user_id: idUser });
    if (active && active.length > 0) {
      await updateUserActiveByUserRepo({ device_id: deviceId, mac_address, user_id: idUser });
    } else {
      await insertUserActiveRepo({ user_id: idUser, device_id: deviceId, mac_address });
    }
  }

  return {
    user_id: idUser,
    user_device_id: userDeviceId,
    device_id: deviceId,
    saved: true,
  };
};

module.exports = {
  getHeartRateInfoService,
  getHeartRateByTimeService,
  getHeartRateHistoryService,
  saveHeartRateDataService,
  saveHeartRateAndUpdateActiveDeviceService,
};
