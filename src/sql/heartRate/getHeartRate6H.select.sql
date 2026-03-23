SELECT
    t.bpm,
    DATE_FORMAT(t.bucket_time, '%H:%i') AS time_hhmm
FROM (
    SELECT
        TIMESTAMP(
            DATE(hr.measured_at),
            MAKETIME(HOUR(hr.measured_at), FLOOR(MINUTE(hr.measured_at) / 30) * 30, 0)
        ) AS bucket_time,
        hr.bpm,
        hr.measured_at,
        hr.id,
        ROW_NUMBER() OVER (
            PARTITION BY TIMESTAMP(
                DATE(hr.measured_at),
                MAKETIME(HOUR(hr.measured_at), FLOOR(MINUTE(hr.measured_at) / 30) * 30, 0)
            )
            ORDER BY hr.measured_at DESC, hr.id DESC
        ) AS rn
    FROM heart_rate_records hr
    JOIN user_devices ud ON hr.user_device_id = ud.id
    JOIN devices d ON ud.device_id = d.id
    WHERE ud.user_id = ?
      AND d.status = 'active'
      AND hr.measured_at <= NOW()
) t
WHERE t.rn = 1
ORDER BY t.bucket_time ASC
LIMIT 12;