SELECT
    uh.heart_rate AS bpm,
    DATE_FORMAT(uh.recorded_at, '%H:%i') AS time_hhmm
FROM user_health uh
JOIN user_devices ud ON uh.user_device_id = ud.id
JOIN devices d ON ud.device_id = d.id
WHERE ud.user_id = ?
  AND d.status = 1
ORDER BY uh.recorded_at DESC
LIMIT 4;