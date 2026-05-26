SELECT u.id,
       u.full_name,
       d.device_id,
       d.device_name
FROM users AS u
LEFT JOIN user_devices AS ud
    ON u.id = ud.user_id
   AND ud.pairing_status = 1
   AND ud.unpaired_at IS NULL
LEFT JOIN devices AS d
    ON d.id = ud.device_id
WHERE u.id = ?
  AND u.password_hash = ?;