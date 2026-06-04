UPDATE user_active_devices
SET is_connected = 0, last_seen_at = NOW()
WHERE user_id = ?;
