SELECT u.id,
       u.full_name,
       d.device_id,
       d.device_name
FROM users AS u
LEFT JOIN user_devices AS ud
    ON u.id = ud.user_id
   AND ud.pairing_status = 1
   AND ud.unpaired_at IS NULL
LEFT JOIN user_active_devices AS uad
    ON uad.user_id = u.id
   AND uad.device_id = ud.device_id
   AND uad.is_connected = 1
LEFT JOIN devices AS d
    ON d.id = uad.device_id
WHERE u.id = ?
  AND u.password_hash = ?;
