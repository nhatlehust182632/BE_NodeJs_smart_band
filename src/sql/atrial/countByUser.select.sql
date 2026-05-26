SELECT COUNT(*) AS total_alerts_today
FROM atrial_fibrillation_alerts
WHERE user_id = ?
  AND DATE(created_at) = COALESCE(?, CURDATE());
