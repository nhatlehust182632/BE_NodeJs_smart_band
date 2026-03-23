SELECT 
    hr.bpm,
    DATE_FORMAT(hr.measured_at, '%H:%i') AS time_hhmm
FROM heart_rate_records hr
JOIN user_devices ud ON hr.user_device_id = ud.id
JOIN devices d ON ud.device_id = d.id
WHERE ud.user_id = ?
  AND d.status = 'active'
ORDER BY hr.measured_at DESC
LIMIT 4;