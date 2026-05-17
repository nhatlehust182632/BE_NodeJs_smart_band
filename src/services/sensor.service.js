const sensorRepository = require('../repositories/sensor.repository');

const saveSensorData = (data, callback) => {
  // console.log(data);

  if (data.device_id) {
    sensorRepository.getUserDeviceByDeviceId(data, (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      if (result[0].user_device_id) {
        // lưu vị trí
        if (data.location) {
          sensorRepository.insertLocation({ ...data.location, id: result[0].user_device_id, timestamp: data.timestamp }, callback);
        }
        // lưu phần trăm pin
        if (data.batery) {
          sensorRepository.insertBatery(data, callback);
        }
        // lưu nhịp tim
        if (data.data) {
          sensorRepository.insertHeartRate({ ...data.data, id: result[0].user_device_id, timestamp: data.timestamp }, callback);
        }
      }
    });
  }
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