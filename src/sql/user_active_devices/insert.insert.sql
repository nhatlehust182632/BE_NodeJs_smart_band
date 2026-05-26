INSERT INTO user_active_devices (
  user_id, device_id, mac_address, is_connected, connected_at, last_seen_at
) VALUES (
  ?, ?, ?, 1, NOW(), NOW()
);
