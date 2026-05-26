SELECT id, user_id, steps, distance_m, calories, recorded_date, created_at
FROM step_counts
WHERE user_id = ? AND recorded_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
ORDER BY recorded_date DESC;
