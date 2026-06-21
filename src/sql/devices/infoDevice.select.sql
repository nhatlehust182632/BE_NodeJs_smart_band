SELECT
    d.device_id,
    d.device_name,
    d.model_name,
    uad.is_connected,
    uad.connected_at,
    uad.last_seen_at
FROM users AS u
LEFT JOIN user_active_devices AS uad
    ON uad.user_id = u.id
   AND uad.is_connected = 1
LEFT JOIN user_devices AS ud
    ON ud.user_id = u.id
   AND ud.device_id = uad.device_id
   AND ud.pairing_status = 1
   AND ud.unpaired_at IS NULL
LEFT JOIN devices AS d
    ON d.id = ud.device_id
WHERE u.id = ?
ORDER BY uad.last_seen_at DESC, uad.connected_at DESC
LIMIT 1;
