SELECT 
    d.model_name,

    CAST(MAX(hr.bpm) AS CHAR) AS max_bpm,
    CAST(MIN(hr.bpm) AS CHAR) AS min_bpm,
    CAST(ROUND(AVG(hr.bpm), 0) AS CHAR) AS avg_bpm,

    CAST((
        SELECT hr2.bpm
        FROM heart_rate_records hr2
        JOIN user_devices ud2 ON hr2.user_device_id = ud2.id
        JOIN devices d2 ON ud2.device_id = d2.id
        WHERE ud2.user_id = u.id
          AND d2.status = 'active'
          AND hr2.measured_at >= CURDATE()
          AND hr2.measured_at < CURDATE() + INTERVAL 1 DAY
        ORDER BY hr2.measured_at DESC
        LIMIT 1
    ) AS CHAR) AS latest_bpm

FROM users u
JOIN user_devices ud ON u.id = ud.user_id
JOIN devices d ON ud.device_id = d.id
JOIN heart_rate_records hr ON hr.user_device_id = ud.id

WHERE u.id = ?
  AND d.status = 'active'
  AND hr.measured_at >= CURDATE()
  AND hr.measured_at < CURDATE() + INTERVAL 1 DAY

GROUP BY d.model_name;