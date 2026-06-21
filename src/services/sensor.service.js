const sensorRepository = require('../repositories/sensor.repository');
const deviceService = require('../services/device.service');
const db = require('../config/db');
const locationService = require('../services/location.service');

const axios = require("axios");

// const handleType0Battery = async (eventType, message) => {
//   if (eventType === 0 && message.length >= 10) {
//     // Type 0: lưu % pin
//     const battery_percent = message.readUInt16BE(8); // d1db9c18074900000032 => 0x0032 = 50

//     // Lấy MAC từ 6 byte đầu
//     const macBuffer = message.slice(0, 6);
//     const macAddress = Array.from(macBuffer)
//       .map((b) => b.toString(16).padStart(2, "0"))
//       .join("");

//     console.log("[TYPE0 BATTERY PACKET]", {
//       rawHex: message.toString("hex"),
//       macAddress,
//       battery_percent,
//     });

//     // Tìm cả user_id và user_device_id theo MAC
//     const [rows] = await db.promise().query(
//       `
//     SELECT 
//       uad.user_id,
//       ud.id AS user_device_id
//     FROM user_active_devices uad
//     LEFT JOIN user_devices ud
//       ON ud.user_id = uad.user_id
//       AND ud.device_id = uad.device_id
//       AND ud.pairing_status = 1
//     WHERE REPLACE(REPLACE(LOWER(uad.mac_address), ':', ''), '-', '') = ?
//     LIMIT 1
//     `,
//       [macAddress]
//     );

//     // const deviceRow = rows && rows.length > 0 ? (Array.isArray(rows[0]) ? rows[0][0] : rows[0]) : null;
//     const deviceRow = rows.length > 0 ? rows[0] : null;

//     if (!deviceRow) {
//       console.error("[TYPE0] Không tìm thấy user theo MAC:", macAddress);
//       return;
//     }

//     const user_id = deviceRow.user_id;
//     const user_device_id = deviceRow.user_device_id;

//     if (!user_device_id) {
//       console.error("[TYPE0] Không tìm thấy user_device_id theo MAC:", {
//         macAddress,
//         user_id,
//       });
//       return;
//     }

//     await deviceService.saveBatteryLogService({
//       user_id,
//       user_device_id,
//       battery_percent,
//       is_charging: 0,
//     });
//   }
// };

const handleType0Battery = async (eventType, message) => {
  if (eventType !== 0) {
    return;
  }

  if (!Buffer.isBuffer(message) || message.length < 12) {
    console.error("[TYPE0] Gói tin pin không hợp lệ:", {
      isBuffer: Buffer.isBuffer(message),
      messageLength: message?.length,
      minimumLength: 12,
      rawHex: Buffer.isBuffer(message) ? message.toString("hex") : null,
    });
    return;
  }

  // Byte 8-9: phần trăm pin
  const battery_percent = message.readUInt16BE(8);

  // Byte 10-11: nhiệt độ pin
  const battery_temperature = message.readUInt16BE(10);

  // Lấy MAC từ 6 byte đầu
  const macBuffer = message.slice(0, 6);
  const macAddress = Array.from(macBuffer)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  console.log("[TYPE0 BATTERY PACKET]", {
    rawHex: message.toString("hex"),
    messageLength: message.length,
    macAddress,
    battery_percent,
    battery_temperature,
  });

  const [rows] = await db.promise().query(
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

  const deviceRow = rows.length > 0 ? rows[0] : null;

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
    battery_temperature,
  });

  console.log("[TYPE0] Đã lưu thông tin pin:", {
    user_id,
    user_device_id,
    battery_percent,
    battery_temperature,
  });
};

const buildPlaceKeyFromCoords = (latitude, longitude) => {
  return `${Number(latitude).toFixed(3)}_${Number(longitude).toFixed(3)}`;
};

// const handleType3Location = async (eventType, message) => {
//   console.log("[TYPE3 LOCATION PACKET]", {
//     rawHex: message.toString("hex"),
//   });
//   if (eventType === 3 && message.length >= 16) {
//     // Lấy latitude/longitude
//     const latRaw = message.readInt32BE(8);
//     const lngRaw = message.readInt32BE(12);
//     const latitude = latRaw / 1e6;
//     const longitude = lngRaw / 1e6;

//     // Lấy MAC để tìm user_id
//     const macBuffer = message.slice(0, 6);
//     const macAddress = Array.from(macBuffer)
//       .map(b => b.toString(16).padStart(2, '0'))
//       .join('');

//     const [userDeviceRows] = await db.promise().query(
//       'SELECT user_id FROM user_active_devices WHERE REPLACE(REPLACE(LOWER(mac_address), ":", ""), "-", "") = ?',
//       [macAddress]
//     );

//     if (!userDeviceRows || userDeviceRows.length === 0) {
//       console.error('User device not found for MAC', macAddress);
//       return;
//     }

//     // const userId = userDevice[0].user_id;
//     const userId = userDeviceRows[0].user_id;

//     // Gọi API service vị trí
//     const place_key = buildPlaceKeyFromCoords(latitude, longitude);
//     const place_name = await getPlaceNameFromCoords(latitude, longitude);

//     await locationService.saveLocationPlaceService({
//       id: userId,
//       latitude,
//       longitude,
//       place_key,
//       place_name
//     });

//     console.log('[Type3] Location saved', latitude, longitude);
//   }
// };

const handleType3Location = async (eventType, message) => {
  console.log("[TYPE3 LOCATION PACKET]", {
    rawHex: message.toString("hex"),
    messageLength: message.length,
  });

  if (eventType !== 3) {
    return;
  }

  const headerLength = 8;
  const coordinatePairLength = 8;

  if (message.length < headerLength + coordinatePairLength) {
    console.error("[TYPE3] Gói tin không đủ dữ liệu:", {
      messageLength: message.length,
      minimumLength: headerLength + coordinatePairLength,
    });
    return;
  }

  const coordinateDataLength = message.length - headerLength;
  const coordinateCount = Math.floor(
    coordinateDataLength / coordinatePairLength
  );
  const remainingBytes =
    coordinateDataLength % coordinatePairLength;

  if (remainingBytes !== 0) {
    console.warn("[TYPE3] Gói tin có byte dư không tạo thành một cặp tọa độ:", {
      coordinateDataLength,
      coordinateCount,
      remainingBytes,
    });
  }

  // Lấy MAC từ 6 byte đầu của header để tìm user_id
  const macBuffer = message.slice(0, 6);
  const macAddress = Array.from(macBuffer)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  const [userDeviceRows] = await db.promise().query(
    `
      SELECT user_id
      FROM user_active_devices
      WHERE REPLACE(REPLACE(LOWER(mac_address), ':', ''), '-', '') = ?
      LIMIT 1
    `,
    [macAddress]
  );

  if (!userDeviceRows || userDeviceRows.length === 0) {
    console.error("[TYPE3] Không tìm thấy thiết bị theo MAC:", macAddress);
    return;
  }

  const userId = userDeviceRows[0].user_id;
  let savedCount = 0;

  for (
    let pairIndex = 0;
    pairIndex < coordinateCount;
    pairIndex += 1
  ) {
    const offset =
      headerLength + pairIndex * coordinatePairLength;

    const latRaw = message.readInt32BE(offset);
    const lngRaw = message.readInt32BE(offset + 4);

    const latitude = latRaw / 1e6;
    const longitude = lngRaw / 1e6;

    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      console.error("[TYPE3] Tọa độ không hợp lệ:", {
        pairIndex,
        offset,
        latRaw,
        lngRaw,
        latitude,
        longitude,
      });
      continue;
    }

    const place_key = buildPlaceKeyFromCoords(
      latitude,
      longitude
    );

    const place_name = await getPlaceNameFromCoords(
      latitude,
      longitude
    );

    await locationService.saveLocationPlaceService({
      id: userId,
      latitude,
      longitude,
      place_key,
      place_name,
    });

    savedCount += 1;

    console.log("[TYPE3] Location saved:", {
      pairIndex,
      latitude,
      longitude,
      place_key,
      place_name,
    });
  }

  console.log("[TYPE3] Location packet processed:", {
    macAddress,
    userId,
    coordinateCount,
    savedCount,
    failedCount: coordinateCount - savedCount,
  });
};

// ==========
const getPlaceNameFromCoords = async (latitude, longitude) => {
  try {
    const lat = Number(latitude);
    const lon = Number(longitude);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      console.error("[TYPE3] Invalid coordinates:", {
        latitude,
        longitude,
      });
      return "Không xác định được tên vị trí";
    }

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          format: "jsonv2",
          lat,
          lon,
          zoom: 18,
          addressdetails: 1,
          "accept-language": "vi",
        },
        headers: {
          "User-Agent": "PulseGoSmartBand/1.0 (contact: le.ntn182632@gmail.com)",
          "Accept": "application/json",
          "Accept-Language": "vi",
        },
        timeout: 10000,
      }
    );

    const address = response.data?.address || {};

    const parts = [
      address.house_number,
      address.road,
      address.neighbourhood,
      address.suburb,
      address.quarter,
      address.village,
      address.town,
      address.city_district,
      address.city,
      address.county,
      address.state,
      address.country,
    ].filter(Boolean);

    return (
      response.data?.display_name ||
      parts.join(", ") ||
      "Không xác định được tên vị trí"
    );
  } catch (error) {
    console.error("[TYPE3] Reverse geocode error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });

    return "Không xác định được tên vị trí";
  }
};

const saveSensorData = async (data, callback) => {
  // Chuyển hex string -> Buffer
  if (typeof data === 'string') data = Buffer.from(data, 'hex');

  const eventType = (data[6] >> 4) & 0x0F;

  if (eventType === 0) {
    // xử lý pin
    await handleType0Battery(eventType, data);
  } else if (eventType === 3) {
    // xử lý vị trí
    await handleType3Location(eventType, data);
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