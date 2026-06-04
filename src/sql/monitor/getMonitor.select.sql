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
    END AS relation,
    IF(uad.is_connected = 1, 1, 0) AS isConnected,
    CASE
        WHEN uh.heart_rate IS NULL THEN 'Chưa có dữ liệu'
        WHEN uh.heart_rate > 130 THEN 'Cảnh báo'
        ELSE 'Bình thường'
    END AS status,
    uh.heart_rate AS heartRate,
    loc_latest.place_name AS location
FROM user_monitor_relations umr
JOIN users u
    ON u.id = umr.target_user_id
LEFT JOIN user_active_devices uad
    ON uad.user_id = u.id
LEFT JOIN user_health uh
    ON uh.id = (
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
WHERE umr.monitor_user_id = ?
  AND umr.status = 2
ORDER BY u.full_name ASC;
