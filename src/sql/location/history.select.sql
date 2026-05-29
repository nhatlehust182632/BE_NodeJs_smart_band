WITH ordered_location AS (
    SELECT
        lh.id,
        lh.latitude,
        lh.longitude,
        lh.place_key,
        lh.place_name,
        lh.recorded_at,
        LAG(lh.place_key) OVER (
            ORDER BY lh.recorded_at DESC, lh.id DESC
        ) AS prev_place_key
    FROM location_histories lh
    WHERE lh.user_id = ?
      AND lh.recorded_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
)
SELECT
    id,
    latitude,
    longitude,
    place_key,
    place_name,
    recorded_at
FROM ordered_location
WHERE prev_place_key IS NULL
   OR NOT (prev_place_key <=> place_key)
ORDER BY recorded_at DESC
LIMIT 10;