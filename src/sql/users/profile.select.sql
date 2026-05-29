SELECT
    u.id,
    u.email,
    u.phone,
    u.full_name,
    u.gender,
    u.date_of_birth,
    TIMESTAMPDIFF(YEAR, u.date_of_birth, CURDATE()) AS age,
    u.height_cm,
    u.weight_kg,
    u.emergency_phone,
    u.enable_heart_rate_alert,
    u.status,
    d.model_name,
    d.device_id AS device_mac_address
FROM users u
LEFT JOIN user_devices ud
    ON ud.user_id = u.id
   AND ud.pairing_status = 1
   AND ud.unpaired_at IS NULL
LEFT JOIN devices d
    ON d.id = ud.device_id
WHERE u.id = ?;