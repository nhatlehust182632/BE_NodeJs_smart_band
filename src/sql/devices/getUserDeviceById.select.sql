SELECT id, device_id, user_id
FROM user_devices
WHERE id = ?
LIMIT 1;
