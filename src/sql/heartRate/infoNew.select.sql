SELECT
    COALESCE((
        SELECT d.model_name
        FROM user_devices ud
        JOIN devices d ON d.id = ud.device_id
        WHERE ud.user_id = u.id
          AND ud.pairing_status = 1
          AND d.status = 1
        ORDER BY ud.is_primary DESC, ud.paired_at DESC, ud.id DESC
        LIMIT 1
    ), 'Chưa có thiết bị') AS model_name,
    COALESCE(CAST(MAX(uh.heart_rate) AS CHAR), '0') AS max_bpm,
    COALESCE(CAST(MIN(uh.heart_rate) AS CHAR), '0') AS min_bpm,
    COALESCE(CAST(ROUND(AVG(uh.heart_rate), 0) AS CHAR), '0') AS avg_bpm,
    COALESCE(CAST((
        SELECT uh2.heart_rate
        FROM user_health uh2
        WHERE uh2.user_id = u.id
          AND uh2.recorded_at >= CURDATE()
          AND uh2.recorded_at < CURDATE() + INTERVAL 1 DAY
        ORDER BY uh2.recorded_at DESC, uh2.id DESC
        LIMIT 1
    ) AS CHAR), '0') AS latest_bpm
FROM users u
LEFT JOIN user_health uh
    ON uh.user_id = u.id
   AND uh.recorded_at >= CURDATE()
   AND uh.recorded_at < CURDATE() + INTERVAL 1 DAY
WHERE u.id = ?
GROUP BY u.id;
