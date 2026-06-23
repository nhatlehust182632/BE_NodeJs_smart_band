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

const buildPacketBufferFromRequest = (body) => {
  const packetHex = body?.packetHex || body?.rawHex || body?.hex;

  if (typeof packetHex === 'string') {
    const normalizedHex = packetHex
      .replace(/^0x/i, '')
      .replace(/[\s:-]/g, '')
      .toLowerCase();

    if (!normalizedHex || normalizedHex.length % 2 !== 0 || !/^[0-9a-f]+$/.test(normalizedHex)) {
      throw new Error('packetHex không hợp lệ');
    }

    return Buffer.from(normalizedHex, 'hex');
  }

  if (typeof body?.base64 === 'string') {
    return Buffer.from(body.base64, 'base64');
  }

  if (Array.isArray(body?.bytes)) {
    if (
      body.bytes.length === 0 ||
      body.bytes.some(
        (byte) =>
          !Number.isInteger(byte) ||
          byte < 0 ||
          byte > 255
      )
    ) {
      throw new Error('bytes không hợp lệ');
    }

    return Buffer.from(body.bytes);
  }

  throw new Error('Thiếu packetHex/rawHex/hex/base64/bytes');
};

const receiveDeviceStatusPacket = async (req, res) => {
  try {
    const data = buildPacketBufferFromRequest(req.body);

    if (data.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Gói tin không đủ 8 byte header',
        packetLength: data.length,
      });
    }

    const eventType = (data[6] >> 4) & 0x0f;

    if (eventType !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Endpoint này chỉ nhận gói trạng thái thiết bị Type 2',
        eventType,
      });
    }

    if (data.length < 11) {
      return res.status(400).json({
        success: false,
        message: 'Gói Type 2 phải có tối thiểu 11 byte',
        packetLength: data.length,
      });
    }

    await sensorService.saveSensorData(data);

    return res.status(202).json({
      success: true,
      message: 'Đã nhận gói Type 2 từ app và chuyển xử lý lưu DB',
      eventType,
      rawHex: data.toString('hex'),
      packetLength: data.length,
    });
  } catch (error) {
    console.error('[DEVICE STATUS API ERROR]', error);

    return res.status(400).json({
      success: false,
      message: error.message || 'Gói tin không hợp lệ',
    });
  }
};

module.exports = {
  createSensorData,
  getAllSensors,
  getLatestSensor,
  receiveDeviceStatusPacket
};
