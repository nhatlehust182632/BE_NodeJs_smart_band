UPDATE users
SET
    full_name = ?,
    gender = ?,
    date_of_birth = ?,
    height_cm = ?,
    weight_kg = ?,
    emergency_phone = ?,
    enable_heart_rate_alert = ?
WHERE id = ?;