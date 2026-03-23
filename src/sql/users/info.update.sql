UPDATE users
SET 
    full_name = ?,
    gender = ?,
    height_cm = ?,
    weight_kg = ?,
    age = ?,
    emergency_contact_name = ?,
    emergency_contact_phone = ?
WHERE id = ?;