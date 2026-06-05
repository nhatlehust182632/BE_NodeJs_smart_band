SELECT
    DATE_FORMAT(created_at, '%Y-%m-%d') AS date,
    DATE_FORMAT(created_at, '%H:%i:%s') AS time,
    'Cảnh báo bất thường' AS message
FROM atrial_fibrillation_alerts
WHERE user_id = ?
  AND DATE(created_at) = COALESCE(?, CURDATE())
ORDER BY created_at DESC, id DESC;
