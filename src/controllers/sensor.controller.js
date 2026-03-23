const sensorService = require('../services/sensor.service');

const createSensorData = (req, res) => {
  const { id, heart_rate, spo2, steps } = req.body;
  if (!id || heart_rate == null || spo2 == null || steps == null) {
    return res.status(400).json({
      success: false,
      message: 'Thieu du lieu',
      body: req.body
    });
  }

  sensorService.saveSensorData(
    { id, heart_rate, spo2, steps },
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Luu du lieu that bai'
        });
      }

      res.status(201).json({
        success: true,
        message: 'Luu du lieu thanh cong',
        insertId: result.insertId
      });
    }
  );
};

const getAllSensors = (req, res) => {
  sensorService.fetchAllSensorData((err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.json({ success: true, data: results });
  });
};

const getLatestSensor = (req, res) => {
  sensorService.fetchLatestSensorData((err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.json({ success: true, data: results[0] || null });
  });
};

module.exports = {
  createSensorData,
  getAllSensors,
  getLatestSensor
};