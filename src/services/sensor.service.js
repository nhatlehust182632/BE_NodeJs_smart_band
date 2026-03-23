const sensorRepository = require('../repositories/sensor.repository');

const saveSensorData = (data, callback) => {
  sensorRepository.insertSensorData(data, callback);
};

const fetchAllSensorData = (callback) => {
  sensorRepository.getAllSensorData(callback);
};

const fetchLatestSensorData = (callback) => {
  sensorRepository.getLatestSensorData(callback);
};

module.exports = {
  saveSensorData,
  fetchAllSensorData,
  fetchLatestSensorData
};