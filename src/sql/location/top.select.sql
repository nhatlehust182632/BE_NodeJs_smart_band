SELECT
    lh.place_key,
    MAX(lh.place_name) AS place_name,
    COUNT(*) AS visit_count,
    MAX(lh.latitude) AS latitude,
    MAX(lh.longitude) AS longitude,
    MAX(lh.recorded_at) AS last_seen_at
FROM location_histories lh
WHERE lh.user_id = ?
  AND lh.recorded_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
  AND lh.place_key IS NOT NULL
GROUP BY lh.place_key
ORDER BY visit_count DESC, last_seen_at DESC
LIMIT 3;