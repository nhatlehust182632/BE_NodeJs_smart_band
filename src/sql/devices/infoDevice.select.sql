SELECT d.model_name
FROM users u
JOIN user_devices ud 
    ON ud.user_id = u.id
JOIN devices d 
    ON d.id = ud.device_id
WHERE u.id = ?
  AND ud.pairing_status = 'paired';