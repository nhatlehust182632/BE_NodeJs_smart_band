SELECT
    umr.id AS id,
    u.full_name AS name,
    TIMESTAMPDIFF(YEAR, u.date_of_birth, CURDATE()) AS age,

    d.device_name AS deviceName,

    CASE umr.relationship_type
        WHEN 1 THEN 'Cha/Mẹ'
        WHEN 2 THEN 'Con'
        WHEN 3 THEN 'Vợ/Chồng'
        WHEN 4 THEN 'Bác sĩ'
        WHEN 5 THEN 'Người chăm sóc'
        WHEN 6 THEN 'Bạn bè'
        WHEN 7 THEN 'Huấn luyện viên'
        ELSE 'Khác'
    END AS relation,

    IF(uad.is_connected = 1, 1, 0) AS isConnected,
    CASE
        WHEN uh_latest.heart_rate IS NULL THEN 'Chưa có dữ liệu'
        WHEN uh_latest.heart_rate > 130 THEN 'Cảnh báo'
        ELSE 'Bình thường'
    END AS heartStatus,
    CASE
        WHEN uh_latest.heart_rate IS NULL THEN 'Chưa có dữ liệu'
        WHEN uh_latest.heart_rate > 130 THEN 'Cao'
        ELSE 'Thấp'
    END AS riskLevel,
    uh_latest.heart_rate AS heartRate,

    loc_latest.place_name AS lastLocation,
    DATE_FORMAT(loc_latest.recorded_at, '%H:%i') AS locationUpdatedAt,

    DATE_FORMAT(
        COALESCE(uh_latest.recorded_at, loc_latest.recorded_at),
        '%d/%m/%Y %H:%i'
    ) AS lastSync,

    battery_latest.battery_percent AS battery

FROM user_monitor_relations umr

JOIN users u
    ON u.id = umr.target_user_id

LEFT JOIN user_devices ud
    ON ud.user_id = u.id
    AND ud.pairing_status = 1
    AND ud.unpaired_at IS NULL

LEFT JOIN devices d
    ON d.id = ud.device_id

LEFT JOIN user_active_devices uad
    ON uad.user_id = u.id

LEFT JOIN user_health uh_latest
    ON uh_latest.id = (
        SELECT uh2.id
        FROM user_health uh2
        WHERE uh2.user_id = u.id
        ORDER BY uh2.recorded_at DESC, uh2.id DESC
        LIMIT 1
    )

LEFT JOIN location_histories loc_latest
    ON loc_latest.id = (
        SELECT loc2.id
        FROM location_histories loc2
        WHERE loc2.user_id = u.id
        ORDER BY loc2.recorded_at DESC, loc2.id DESC
        LIMIT 1
    )

LEFT JOIN device_battery_logs battery_latest
    ON battery_latest.id = (
        SELECT dbl.id
        FROM device_battery_logs dbl
        WHERE dbl.user_device_id = ud.id
        ORDER BY dbl.recorded_at DESC, dbl.id DESC
        LIMIT 1
    )

WHERE umr.id = ?
  AND umr.status = 2;
