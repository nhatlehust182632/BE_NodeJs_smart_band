SELECT
    final.bpm,
    DATE_FORMAT(final.bucket_time, '%H:%i') AS time_hhmm
FROM (
    SELECT *
    FROM (
        SELECT
            t.bpm,
            t.bucket_time
        FROM (
            SELECT
                TIMESTAMP(
                    DATE(uh.recorded_at),
                    MAKETIME(
                        FLOOR(HOUR(uh.recorded_at) / 2) * 2,
                        0,
                        0
                    )
                ) AS bucket_time,
                uh.heart_rate AS bpm,
                uh.recorded_at,
                uh.id,
                ROW_NUMBER() OVER (
                    PARTITION BY TIMESTAMP(
                        DATE(uh.recorded_at),
                        MAKETIME(
                            FLOOR(HOUR(uh.recorded_at) / 2) * 2,
                            0,
                            0
                        )
                    )
                    ORDER BY uh.recorded_at DESC, uh.id DESC
                ) AS rn
            FROM user_health uh
            WHERE uh.user_id = ?
              AND uh.recorded_at >= NOW() - INTERVAL 24 HOUR
              AND uh.recorded_at <= NOW()
        ) t
        WHERE t.rn = 1
        ORDER BY t.bucket_time DESC
        LIMIT 12
    ) latest_12
    ORDER BY latest_12.bucket_time ASC
) final;
