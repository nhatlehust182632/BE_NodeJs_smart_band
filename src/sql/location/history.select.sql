SELECT
    lh.id,
    lh.latitude,
    lh.longitude,
    lh.place_name,
    lh.recorded_at
FROM location_histories lh
WHERE lh.user_id = ?
ORDER BY lh.recorded_at DESC
LIMIT 10; 
