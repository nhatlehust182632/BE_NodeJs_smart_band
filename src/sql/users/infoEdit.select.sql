SELECT
    id,
    email,
    phone,
    full_name,
    gender,
    date_of_birth,
    height_cm,
    weight_kg,
    emergency_phone,
    enable_heart_rate_alert,
    status,
    created_at,
    updated_at
FROM users
WHERE id = ?
LIMIT 1;