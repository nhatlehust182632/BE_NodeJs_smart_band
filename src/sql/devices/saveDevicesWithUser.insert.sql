INSERT INTO user_devices (
    user_id, 
    device_id,
    is_primary, 
    pairing_status
) VALUES
(
    ?,
    ?,
    ?,
    ?
);