const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const axios = require('axios');
const { log } = require('console');
const cache = new Map();

const sqlinsertSql = fs.readFileSync(
  path.join(__dirname, '../sql/sensor.insert.sql'),
  'utf8'
);

// check device_id ton tai va da ket noi
const getUserDeviceByDeviceId = async (data, callback) => {
  const sql = `
    SELECT ud.id as user_device_id FROM user_devices ud
      WHERE ud.device_id = ? LIMIT 1;
  `;
  db.query(
    sql,
    [data.device_id],
    callback
  );
};

function generatePlaceKey(lat, lng, precision = 3) {
  return `${Number(lat).toFixed(precision)}_${Number(lng).toFixed(precision)}`;
}

async function getLocation(lat, lng) {
  try {
    const placeKey = generatePlaceKey(lat, lng);

    if (cache.has(placeKey)) {
      return cache.get(placeKey);
    }

    const response = await axios.get(
      'https://nominatim.openstreetmap.org/reverse',
      {
        params: {
          lat,
          lon: lng,
          format: 'json',
          'accept-language': 'vi'
        },
        headers: {
          'User-Agent': 'smart-band-app/1.0'
        },
        timeout: 5000
      }
    );

    const data = response.data;

    const result = {
      latitude: Number(lat),
      longitude: Number(lng),
      place_key: placeKey,
      place_name: data.display_name || null,
      address: data.address || null
    };

    cache.set(placeKey, result);

    return result;

  } catch (error) {
    console.error('getLocation error:', error.message);

    return {
      latitude: Number(lat),
      longitude: Number(lng),
      place_key: generatePlaceKey(lat, lng),
      place_name: null
    };
  }
}

const insertLocation = async (data, callback) => {
  const location = await getLocation(data.lat, data.long);
  const sql = `
    INSERT INTO location_histories (
    user_device_id, latitude, longitude, place_key, place_name, recorded_at
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;
  // (5001, 21.0285110, 105.8048170, '21.0285_105.8048', 'Hồ Gươm', CURDATE() + INTERVAL 8 HOUR),
  db.query(
    sql,
    [data.id, data.lat, data.long, location.place_key, location.place_name, data.timestamp],
    callback
  );
};

const insertBatery = (data, callback) => {
  const sql = `
    UPDATE devices SET battery_level = ? WHERE id = ?;
  `;
  db.query(
    sql,
    [data.batery, data.device_id],
    callback
  );
};

const insertHeartRate = (data, callback) => {
  const sql = `INSERT INTO heart_rate_records(
        user_device_id, measured_at, bpm, source, quality_score
      ) VALUES (?, ?, ?, ?, ?);
  `;
  db.query(
    sql,
    [data.id, data.timestamp, data.ppg, 'sensor', '100'],
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

const findActiveUserDeviceByMac = async (macAddress) => {
  const sql = `
    SELECT
      uad.user_id,
      ud.id AS user_device_id
    FROM user_active_devices uad
    LEFT JOIN user_devices ud
      ON ud.user_id = uad.user_id
      AND ud.device_id = uad.device_id
      AND ud.pairing_status = 1
    WHERE REPLACE(REPLACE(LOWER(uad.mac_address), ':', ''), '-', '') = ?
    LIMIT 1
  `;

  const [rows] = await db.promise().query(sql, [macAddress]);
  return rows.length > 0 ? rows[0] : null;
};

const findDeviceStatusDefinitions = async ({
  bleStatus,
  imuStatus,
  ppgStatus,
  gaugeStatus,
  gnssStatus,
  lteStatus,
}) => {
  const sql = `
    SELECT
      component_code,
      status_value,
      status_code,
      status_name
    FROM device_status_definitions
    WHERE (component_code = 'BLE' AND status_value = ?)
       OR (component_code = 'IMU' AND status_value = ?)
       OR (component_code = 'PPG' AND status_value = ?)
       OR (component_code = 'GAUGE' AND status_value = ?)
       OR (component_code = 'GNSS' AND status_value = ?)
       OR (component_code = 'LTE' AND status_value = ?)
  `;

  const [rows] = await db.promise().query(sql, [
    bleStatus,
    imuStatus,
    ppgStatus,
    gaugeStatus,
    gnssStatus,
    lteStatus,
  ]);

  return rows;
};

const insertDeviceStatusLog = async (data) => {
  const sql = `
    INSERT INTO device_status_logs (
      user_device_id,
      event_type,
      cycle_id,
      packet_index,
      ble_status,
      imu_status,
      ppg_status,
      gauge_status,
      gnss_status,
      lte_status,
      raw_byte_7,
      raw_byte_8,
      raw_byte_9,
      raw_byte_10,
      raw_byte_11,
      raw_packet_hex,
      recorded_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  const [result] = await db.promise().query(sql, [
    data.user_device_id,
    data.eventType,
    data.cycleId,
    data.packetIndex,
    data.bleStatus,
    data.imuStatus,
    data.ppgStatus,
    data.gaugeStatus,
    data.gnssStatus,
    data.lteStatus,
    data.byte7,
    data.byte8,
    data.byte9,
    data.byte10,
    data.byte11,
    data.rawPacketHex,
  ]);

  return result;
};


module.exports = {
  getUserDeviceByDeviceId,
  insertLocation,
  insertBatery,
  insertHeartRate,
  getAllSensorData,
  getLatestSensorData,
  findActiveUserDeviceByMac,
  findDeviceStatusDefinitions,
  insertDeviceStatusLog
};
