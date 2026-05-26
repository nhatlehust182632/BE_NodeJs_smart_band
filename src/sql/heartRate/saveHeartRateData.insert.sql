INSERT INTO user_health (
    user_device_id,
    heart_rate,
    recorded_at
)
SELECT
    ud.id,
    ?,
    NOW()
FROM user_devices ud
WHERE ud.id = ?
  AND ud.user_id = ?
LIMIT 1;
