SELECT
    umr.id AS id,
    u.full_name AS name,
    TIMESTAMPDIFF(YEAR, u.date_of_birth, CURDATE()) AS age,
    CASE umr.relationship_type
        WHEN 1 THEN 'Cha/Mẹ'
        WHEN 2 THEN 'Con'
        WHEN 3 THEN 'Vợ/Chồng'
        WHEN 4 THEN 'Bác sĩ'
        WHEN 5 THEN 'Người chăm sóc'
        WHEN 6 THEN 'Bạn bè'
        WHEN 7 THEN 'Huấn luyện viên'
        ELSE 'Khác'
    END AS relation
    umr.status AS isConnected,
    IF(uh.heart_rate > 130, 'Cảnh báo', 'Bình thường') AS status,
    uh.heart_rate AS heartRate,
    loc_latest.place_name AS location
FROM user_monitor_relations umr
JOIN users u
    ON u.id = umr.target_user_id
JOIN user_devices ud
    ON ud.user_id = u.id
   AND ud.pairing_status = 1
LEFT JOIN devices d
    ON d.id = ud.device_id
LEFT JOIN user_health uh
    ON uh.id = (
        SELECT uh2.id
        FROM user_health uh2
        JOIN user_devices ud2
            ON uh2.user_device_id = ud2.id
        WHERE ud2.user_id = u.id
          AND ud2.pairing_status = 1
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
WHERE umr.monitor_user_id = ?
  AND umr.status = 2
ORDER BY u.full_name ASC;


