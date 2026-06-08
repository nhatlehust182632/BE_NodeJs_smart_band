const sensorRepository = require('../repositories/sensor.repository');
const deviceService = require('../services/device.service');
const db = require('../config/db');
const locationService = require('../services/location.service');

const handleType0Battery = async (eventType, message) => {
  if (eventType === 0 && message.length >= 10) {
    // Type 0: lưu % pin
    const battery_percent = message.readUInt16BE(8); // d1db9c18074900000032 => 0x0032 = 50

    // Lấy MAC từ 6 byte đầu
    const macBuffer = message.slice(0, 6);
    const macAddress = Array.from(macBuffer)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    console.log("[TYPE0 BATTERY PACKET]", {
      rawHex: message.toString("hex"),
      macAddress,
      battery_percent,
    });

    // Tìm cả user_id và user_device_id theo MAC
    const rows = await db.query(
      `
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
    `,
      [macAddress]
    );

    const deviceRow = Array.isArray(rows[0]) ? rows[0][0] : rows[0];

    if (!deviceRow) {
      console.error("[TYPE0] Không tìm thấy user theo MAC:", macAddress);
      return;
    }

    const user_id = deviceRow.user_id;
    const user_device_id = deviceRow.user_device_id;

    if (!user_device_id) {
      console.error("[TYPE0] Không tìm thấy user_device_id theo MAC:", {
        macAddress,
        user_id,
      });
      return;
    }

    await deviceService.saveBatteryLogService({
      user_id,
      user_device_id,
      battery_percent,
      is_charging: 0,
    });
  }
};

const buildPlaceKeyFromCoords = (latitude, longitude) => {
  return `${Number(latitude).toFixed(3)}_${Number(longitude).toFixed(3)}`;
};

const handleType3Location = async (eventType, message) => {
  if (eventType === 3 && message.length >= 16) {
    // Lấy latitude/longitude
    const latRaw = message.readInt32BE(8);
    const lngRaw = message.readInt32BE(12);
    const latitude = latRaw / 1e6;
    const longitude = lngRaw / 1e6;

    // Lấy MAC để tìm user_id
    const macBuffer = message.slice(0, 6);
    const macAddress = Array.from(macBuffer)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const userDevice = await db.query(
      'SELECT user_id FROM user_active_devices WHERE REPLACE(REPLACE(LOWER(mac_address), ":", ""), "-", "") = ?',
      [macAddress]
    );

    if (userDevice.length === 0) {
      console.error('User device not found for MAC', macAddress);
      return;
    }

    const userId = userDevice[0].user_id;

    // Gọi API service vị trí
    const place_key = buildPlaceKeyFromCoords(latitude, longitude);
    const place_name = await getPlaceNameFromCoords(latitude, longitude);

    await locationService.saveLocationPlaceService({
      id: userId,
      latitude,
      longitude,
      place_key,
      place_name
    });

    console.log('[Type3] Location saved', latitude, longitude);
  }
};

const getPlaceNameFromCoords = async (latitude, longitude) => {
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: {
        format: "jsonv2",
        lat: latitude,
        lon: longitude,
        zoom: 18,
        addressdetails: 1,
      },
      headers: {
        "User-Agent": "smart-band-backend/1.0",
      },
      timeout: 5000,
    });

    const address = response.data?.address || {};

    const parts = [
      address.house_number,
      address.road,
      address.suburb,
      address.quarter,
      address.village,
      address.town,
      address.city_district,
      address.city,
      address.state,
      address.country,
    ].filter(Boolean);

    return (
      response.data?.display_name ||
      parts.join(", ") ||
      "Không xác định được tên vị trí"
    );
  } catch (error) {
    console.error("[TYPE3] Reverse geocode error:", error.message);
    return "Không xác định được tên vị trí";
  }
};

const saveSensorData = async (data, callback) => {
  // Chuyển hex string -> Buffer
  if (typeof message === 'string') message = Buffer.from(message, 'hex');

  const eventType = (message[6] >> 4) & 0x0F;

  if (eventType === 0) {
    // xử lý pin
    await handleType0Battery(eventType, message);
  } else if (eventType === 3) {
    // xử lý vị trí
    await handleType3Location(eventType, message);
  } else {
    console.log('Unknown type', eventType);
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