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


module.exports = {
  getUserDeviceByDeviceId,
  insertLocation,
  insertBatery,
  insertHeartRate,
  getAllSensorData,
  getLatestSensorData
};