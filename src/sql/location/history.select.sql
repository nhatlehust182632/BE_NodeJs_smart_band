SELECT
    t.id,
    t.latitude,
    t.longitude,
    t.place_key,
    t.place_name,
    t.created_at
FROM (
    SELECT
        lh.id,
        lh.latitude,
        lh.longitude,
        lh.place_key,
        lh.place_name,
        lh.recorded_at,
        lh.created_at,
        ROW_NUMBER() OVER (
            PARTITION BY lh.place_key
            ORDER BY lh.recorded_at DESC
        ) AS rn
    FROM location_histories lh
    JOIN user_devices ud ON ud.id = lh.user_device_id
    JOIN users u ON u.id = ud.user_id
    WHERE u.id = ?
) t
WHERE t.rn = 1
ORDER BY t.recorded_at DESC
LIMIT 3;