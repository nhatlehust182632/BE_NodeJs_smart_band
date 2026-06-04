SELECT
    uh.heart_rate AS bpm,
    DATE_FORMAT(uh.recorded_at, '%H:%i') AS time_hhmm
FROM user_health uh
WHERE uh.user_id = ?
ORDER BY uh.recorded_at DESC
LIMIT 4;
