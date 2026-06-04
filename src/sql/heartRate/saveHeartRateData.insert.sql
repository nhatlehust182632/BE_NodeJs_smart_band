INSERT INTO user_health (
    user_id,
    heart_rate,
    recorded_at
)
SELECT
    u.id,
    ?,
    NOW()
FROM users u
WHERE u.id = ?
  AND u.status = 1
LIMIT 1;
