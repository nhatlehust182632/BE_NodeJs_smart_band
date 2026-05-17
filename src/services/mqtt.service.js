const sensorRepository = require('../repositories/sensor.repository');

const saveInfoFromDevices = (data, callback) => {
    sensorRepository.insertSensorData(data, callback);
};

module.exports = {
    saveInfoFromDevices
};