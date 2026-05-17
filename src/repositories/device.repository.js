const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const { runSqlRepository } = require('../../src/repositories/utils.repository');
// get device info by user id
const sqlInfoDevice = fs.readFileSync(
  path.join(__dirname, '../sql/devices/infoDevice.select.sql'),
  'utf8'
)
const getDevicesInfo = (data, callback) => {
  db.query(
    sqlInfoDevice,
    [data.id],
    callback
  );
};
// check device exist
const sqlInfoDeviceCheckExist = fs.readFileSync(
  path.join(__dirname, '../sql/devices/deviceExistCheck.select.sql'),
  'utf8'
)
const getDevicesInfoExistCheck = (data, callback) => {
  db.query(
    sqlInfoDeviceCheckExist,
    [data.idDevices, data.userId],
    callback
  );
};
// check device exist by ID
const sqlInfoDeviceCheckExistById = fs.readFileSync(
  path.join(__dirname, '../sql/devices/deviceExistCheckById.select.sql'),
  'utf8'
)
const getDevicesInfoExistCheckById = (data, callback) => {
  db.query(
    sqlInfoDeviceCheckExistById,
    [data.idDevices, data.userId],
    callback
  );
};

// get id user_device by id device and id user
const sqlIdUserDeviceById = fs.readFileSync(
  path.join(__dirname, '../sql/devices/deviceExistCheckById.select.sql'),
  'utf8'
)
const getIdUserDeviceByIdDeviceAndIdUser = (data, callback) => {
  db.query(
    sqlIdUserDeviceById,
    [data.idDevices, data.userId],
    callback
  );
};

// const getDevicesInfoExistCheck = (data) => {
//   return runSqlRepository({
//     sqlDatabase: 'devices/deviceExistCheck.select.sql',
//     data: [data.idDevices, data.userId]
//   });
// };
// save devices
const sqlSaveDevices = fs.readFileSync(
  path.join(__dirname, '../sql/devices/saveDevices.insert.sql'),
  'utf8'
)
const postSaveDevices = (data, callback) => {
  db.query(
    sqlSaveDevices,
    [data.idDevices, data.idDevices, data.nameDevice || data.idDevices, 'active'],
    callback
  );
};
// get device id
const sqlDevicesId = fs.readFileSync(
  path.join(__dirname, '../sql/devices/deviceId.select.sql'),
  'utf8'
)
const getDeviceId = (data, callback) => {
  db.query(
    sqlDevicesId,
    [data.idDevices],
    callback
  );
};
// save devices with user
const sqlSaveDevicesWithUser = fs.readFileSync(
  path.join(__dirname, '../sql/devices/saveDevicesWithUser.insert.sql'),
  'utf8'
)
const postSaveDevicesWithUser = (data, callback) => {
  db.query(
    sqlSaveDevicesWithUser,
    [data.userId, data.idDevices, true, 'paired'],
    callback
  );
};
// get device id by user id
const getDeviceIdByUserId = (data) => {
  return runSqlRepository({
    sqlDatabase: 'devices/getDeviceByUserId.select.sql',
    data: [data.id]
  });
};

module.exports = {
  getDevicesInfo,
  getDevicesInfoExistCheck,
  getDevicesInfoExistCheckById,
  getIdUserDeviceByIdDeviceAndIdUser,
  postSaveDevices,
  getDeviceId,
  postSaveDevicesWithUser,
  getDeviceIdByUserId
};
