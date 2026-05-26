UPDATE step_counts
SET steps = ?
WHERE user_id = ? AND recorded_date = ?;
