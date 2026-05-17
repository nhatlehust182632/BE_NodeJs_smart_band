const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const { runSqlRepository } = require('../../src/repositories/utils.repository');

const insertSql = fs.readFileSync(
  path.join(__dirname, '../sql/users/register.inser.sql'),
  'utf8'
)
const insertRegister = (data, callback) => {
  db.query(
    insertSql,
    [data.id, data.phone, data.full_name, data.password_hash],
    callback
  );
};

const sqlLoginUser = fs.readFileSync(
  path.join(__dirname, '../sql/users/login.select.sql'),
  'utf8'
)
const getLoginUser = (data, callback) => {
  db.query(
    sqlLoginUser,
    [data.id, data.password_hash],
    callback
  );
};

const sqlProfileInfo = fs.readFileSync(
  path.join(__dirname, '../sql/users/profile.select.sql'),
  'utf8'
)
const getProfileInfo = (data, callback) => {
  db.query(
    sqlProfileInfo,
    [data.id],
    callback
  );
};
// getInfoEdit
const sqlUserInfoEdit = fs.readFileSync(
  path.join(__dirname, '../sql/users/infoEdit.select.sql'),
  'utf8'
)
const getUserInfoEdit = (data, callback) => {
  db.query(
    sqlUserInfoEdit,
    [data.id],
    callback
  );
};

// save Info User
const sqlUserInfoUpdate = fs.readFileSync(
  path.join(__dirname, '../sql/users/info.update.sql'),
  'utf8'
)
const postUserInfoUpdate = (data, callback) => {
  console.log("111 : " + data.full_name + data.gender);
  db.query(
    sqlUserInfoUpdate,
    [
      data.full_name, data.gender, data.height_cm, data.weight_kg, data.age,
      data.emergency_contact_name, data.emergency_contact_phone, data.id
    ],
    callback
  );
};

const getUserDeviceId = (data) => {
  return runSqlRepository({
    sqlDatabase: 'users/getUserDevice.sql',
    data: [data.id]
  });
};

module.exports = {
  insertRegister,
  getLoginUser,
  getProfileInfo,
  getUserInfoEdit,
  postUserInfoUpdate,
  getUserDeviceId
};