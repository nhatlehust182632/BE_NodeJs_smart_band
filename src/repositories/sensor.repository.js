const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const insertSql = fs.readFileSync(
  path.join(__dirname, '../sql/sensor.insert.sql'),
  'utf8'
);
const insertSensorData = (data, callback) => {
  // const sql = `
  //   INSERT INTO sensor_data (id, heart_rate, spo2, steps)
  //   VALUES (?, ?, ?, ?)
  // `;
  db.query(
    insertSql,
    [data.device_id, data.heart_rate, data.spo2, data.steps],
    callback
  );
};

const getAllSensorData = (callback) => {
  const sql = 'SELECT * FROM sensor_data ORDER BY created_at DESC';
  db.query(sql, callback);
};

const getLatestSensorData = (callback) => {
  const sql = 'SELECT * FROM sensor_data ORDER BY created_at DESC LIMIT 1';
  db.query(sql, callback);
};

module.exports = {
  insertSensorData,
  getAllSensorData,
  getLatestSensorData
};