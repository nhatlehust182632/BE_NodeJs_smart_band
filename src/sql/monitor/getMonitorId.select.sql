SELECT
    u.full_name AS name,
    TIMESTAMPDIFF(YEAR, u.date_of_birth, CURDATE()) AS age,
    umr.note AS relation,
    umr.status AS isConnected,
    IF(uh_latest.heart_rate > 130, 'Cảnh báo', 'Bình thường') AS status,
    uh_latest.heart_rate AS heartRate,
    loc_latest.place_name AS location
FROM user_monitor_relations umr
JOIN users u
    ON u.id = umr.target_user_id
LEFT JOIN user_health uh_latest
    ON uh_latest.id = (
        SELECT uh2.id
        FROM user_devices ud2
        JOIN user_health uh2
            ON uh2.user_device_id = ud2.id
        WHERE ud2.user_id = u.id
          AND ud2.pairing_status = 1
        ORDER BY uh2.recorded_at DESC, uh2.id DESC
        LIMIT 1
    )
LEFT JOIN location_histories loc_latest
    ON loc_latest.id = (
        SELECT loc2.id
        FROM user_devices ud3
        JOIN location_histories loc2
            ON loc2.user_device_id = ud3.id
        WHERE ud3.user_id = u.id
          AND ud3.pairing_status = 1
        ORDER BY loc2.recorded_at DESC, loc2.id DESC
        LIMIT 1
    )
LEFT JOIN user_devices ud_latest
    ON ud_latest.id = COALESCE(uh_latest.user_device_id, loc_latest.user_device_id)
LEFT JOIN devices d
    ON d.id = ud_latest.device_id
WHERE umr.id = ?;