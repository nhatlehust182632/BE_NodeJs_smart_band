const fs = require('fs');
const path = require('path');
const db = require('../config/db');

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

module.exports = {
  getDevicesInfo,
};