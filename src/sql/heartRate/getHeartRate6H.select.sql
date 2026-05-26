SELECT
    t.bpm,
    DATE_FORMAT(t.bucket_time, '%H:%i') AS time_hhmm
FROM (
    SELECT
        TIMESTAMP(
            DATE(uh.recorded_at),
            MAKETIME(HOUR(uh.recorded_at), FLOOR(MINUTE(uh.recorded_at) / 30) * 30, 0)
        ) AS bucket_time,
        uh.heart_rate AS bpm,
        uh.recorded_at,
        uh.id,
        ROW_NUMBER() OVER (
            PARTITION BY TIMESTAMP(
                DATE(uh.recorded_at),
                MAKETIME(HOUR(uh.recorded_at), FLOOR(MINUTE(uh.recorded_at) / 30) * 30, 0)
            )
            ORDER BY uh.recorded_at DESC, uh.id DESC
        ) AS rn
    FROM user_health uh
    JOIN user_devices ud ON uh.user_device_id = ud.id
    JOIN devices d ON ud.device_id = d.id
    WHERE ud.user_id = ?
      AND d.status = 1
      AND uh.recorded_at <= NOW()
) t
WHERE t.rn = 1
ORDER BY t.bucket_time ASC
LIMIT 12;