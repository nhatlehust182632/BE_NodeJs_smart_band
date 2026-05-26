INSERT INTO step_counts (user_id, steps, distance_m, calories, recorded_date, created_at)
VALUES (?, ?, ?, ?, ?, NOW())
ON DUPLICATE KEY UPDATE
  steps = VALUES(steps),
  distance_m = VALUES(distance_m),
  calories = VALUES(calories);
