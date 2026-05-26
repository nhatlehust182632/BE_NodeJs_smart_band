const util = require('util');
const getHeartRateInfo = require('../repositories/heartRate.repository');
const deviceRepository = require('../repositories/device.repository');

const getHeartRateInfoService = async (data) => {
  const resultHeartRateNow = await getHeartRateInfo.getHeartRateInfoRepository(data);
  if (!resultHeartRateNow || resultHeartRateNow.length === 0) {
    return null;
  }
  return resultHeartRateNow[0];
};

const getHeartRateByTimeService = async (data) => {
  const resultHeartRateByTimes = await getHeartRateInfo.getHeartRateByTimeRepository(data);
  if (!resultHeartRateByTimes || resultHeartRateByTimes.length === 0) {
    return null;
  }
  return resultHeartRateByTimes;
};

const getHeartRateHistoryService = async (data) => {
  const resultHeartRateByTimes = await getHeartRateInfo.getHeartRateHistoryRepository(data);
  if (!resultHeartRateByTimes || resultHeartRateByTimes.length === 0) {
    return null;
  }
  return resultHeartRateByTimes;
};

const saveHeartRateDataService = async (data) => {
  const result = await getHeartRateInfo.saveHeartRateDataRepository(data);
  if (!result || result.affectedRows === 0) {
    return null;
  }
  return result;
};

const getDeviceIdRepo = util.promisify(deviceRepository.getDeviceId);
const getUserDeviceByIdRepo = util.promisify(deviceRepository.getUserDeviceById);
const getIdUserDeviceByIdDeviceAndIdUserRepo = util.promisify(deviceRepository.getIdUserDeviceByIdDeviceAndIdUser);
const postSaveDevicesWithUserRepo = util.promisify(deviceRepository.postSaveDevicesWithUser);
const getUserActiveByUserRepo = util.promisify(deviceRepository.getUserActiveByUser);
const insertUserActiveRepo = util.promisify(deviceRepository.insertUserActive);
const updateUserActiveByUserRepo = util.promisify(deviceRepository.updateUserActiveByUser);

const saveHeartRateAndUpdateActiveDeviceService = async (data) => {
  // data: { idUser, idDevices (user_device_id)?, bpm, mac_address }
  const { idUser, idDevices, bpm, mac_address } = data;
  if (!idUser || bpm == null) {
    throw new Error('Thiếu idUser hoặc bpm');
  }

  let userDeviceId = idDevices || null;
  let deviceId = null;

  if (userDeviceId) {
    // get device_id from user_devices
    const ud = await getUserDeviceByIdRepo({ user_device_id: userDeviceId });
    if (!ud || ud.length === 0) {
      throw new Error('Không tìm thấy user_device tương ứng');
    }
    deviceId = ud[0].device_id;
    // } else if (idDevices) {
    //   // find device by device_id
    //   const devRows = await getDeviceIdRepo({ idDevices: idDevices });
    //   if (!devRows || devRows.length === 0) {
    //     throw new Error('Không tìm thấy device theo device_id');
    //   }
    //   deviceId = devRows[0].id;

    //   // find existing user_device for this user and device
    //   const udExist = await getIdUserDeviceByIdDeviceAndIdUserRepo({ idDevices: deviceId, userId: idUser });
    //   if (udExist && udExist.length > 0) {
    //     userDeviceId = udExist[0].id;
    //   } else {
    //     // create user_devices linking
    //     const insertUd = await postSaveDevicesWithUserRepo({ userId: idUser, idDevices: deviceId });
    //     if (!insertUd) {
    //       throw new Error('Không thể tạo user_device');
    //     }
    //     userDeviceId = insertUd.insertId;
    //   }
  } else {
    throw new Error('Cần cung cấp user_device id hoặc idDevices');
  }

  // save heart rate
  const saveResult = await getHeartRateInfo.saveHeartRateDataRepository({ bpm, idDevices: userDeviceId, idUser });
  if (!saveResult || saveResult.affectedRows === 0) {
    throw new Error('Lưu nhịp tim thất bại');
  }

  // update or insert user_active_devices
  if (idDevices) {
    const active = await getUserActiveByUserRepo({ user_id: idUser });
    if (active && active.length > 0) {
      await updateUserActiveByUserRepo({ device_id: deviceId, mac_address, user_id: idUser });
    } else {
      await insertUserActiveRepo({ user_id: idUser, device_id: deviceId, mac_address });
    }
  }

  return {
    user_device_id: userDeviceId,
    device_id: deviceId,
    saved: true
  };
};

module.exports = {
  getHeartRateInfoService,
  getHeartRateByTimeService,
  getHeartRateHistoryService,
  saveHeartRateDataService,
  saveHeartRateAndUpdateActiveDeviceService
};