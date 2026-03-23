SELECT 
    u.id,
    u.phone,
    u.full_name,
    u.age,
    u.gender,
    u.emergency_contact_name,
    u.emergency_contact_phone,
    d.model_name
FROM users u
LEFT JOIN user_devices ud
    ON ud.user_id = u.id
   AND ud.pairing_status = 'paired'
   AND ud.unpaired_at IS NULL
LEFT JOIN devices d
    ON d.id = ud.device_id
WHERE u.id = ?;