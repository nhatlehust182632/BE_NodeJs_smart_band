SELECT
    MAX(lh.latitude) AS latitude,
    MAX(lh.longitude) AS longitude,
    lh.place_key,
    MAX(lh.place_name) AS place_name
FROM location_histories lh
JOIN user_devices ud ON ud.id = lh.user_device_id
JOIN users u ON u.id = ud.user_id
WHERE u.id = ?
  AND lh.place_key IS NOT NULL
GROUP BY lh.place_key
ORDER BY COUNT(*) DESC, MAX(lh.recorded_at) DESC
LIMIT 3;