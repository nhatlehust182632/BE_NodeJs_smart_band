UPDATE user_active_devices SET device_id = ?, mac_address = ?, is_connected = 1, last_seen_at = NOW() WHERE user_id = ?;
