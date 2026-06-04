INSERT INTO device_battery_logs (
    user_device_id,
    battery_percent,
    is_charging,
    recorded_at
)
SELECT
    ud.id,
    ?,
    ?,
    NOW()
FROM user_devices ud
WHERE ud.id = ?
  AND ud.user_id = ?
  AND ud.pairing_status = 1
LIMIT 1;
