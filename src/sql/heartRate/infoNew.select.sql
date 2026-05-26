SELECT
    d.model_name,
    CAST(MAX(uh.heart_rate) AS CHAR) AS max_bpm,
    CAST(MIN(uh.heart_rate) AS CHAR) AS min_bpm,
    CAST(ROUND(AVG(uh.heart_rate), 0) AS CHAR) AS avg_bpm,
    CAST((
        SELECT uh2.heart_rate
        FROM user_health uh2
        JOIN user_devices ud2 ON uh2.user_device_id = ud2.id
        JOIN devices d2 ON ud2.device_id = d2.id
        WHERE ud2.user_id = u.id
          AND d2.status = 1
          AND uh2.recorded_at >= CURDATE()
          AND uh2.recorded_at < CURDATE() + INTERVAL 1 DAY
        ORDER BY uh2.recorded_at DESC
        LIMIT 1
    ) AS CHAR) AS latest_bpm
FROM users u
JOIN user_devices ud ON u.id = ud.user_id
JOIN devices d ON ud.device_id = d.id
JOIN user_health uh ON uh.user_device_id = ud.id
WHERE u.id = ?
  AND d.status = 1
  AND uh.recorded_at >= CURDATE()
  AND uh.recorded_at < CURDATE() + INTERVAL 1 DAY
GROUP BY d.model_name;