SELECT
    u.full_name as name,
    u.age,
    umr.note as relation,
    umr.status as isConnected,
	if(hr_latest.quality_score > 130, 'Cảnh báo', 'Bình thường') as status,
    hr_latest.quality_score AS heartRate,
	loc_latest.place_name as location
FROM user_monitor_relations umr
JOIN users u
    ON u.id = umr.target_user_id
LEFT JOIN heart_rate_records hr_latest
    ON hr_latest.id = (
        SELECT hr2.id
        FROM user_devices ud2
        JOIN heart_rate_records hr2
            ON hr2.user_device_id = ud2.id
        WHERE ud2.user_id = u.id
          AND ud2.pairing_status = 'paired'
        ORDER BY hr2.measured_at DESC, hr2.id DESC
        LIMIT 1
    )
LEFT JOIN location_histories loc_latest
    ON loc_latest.id = (
        SELECT loc2.id
        FROM user_devices ud3
        JOIN location_histories loc2
            ON loc2.user_device_id = ud3.id
        WHERE ud3.user_id = u.id
          AND ud3.pairing_status = 'paired'
        ORDER BY loc2.recorded_at DESC, loc2.id DESC
        LIMIT 1
    )
LEFT JOIN user_devices ud_latest
    ON ud_latest.id = COALESCE(hr_latest.user_device_id, loc_latest.user_device_id)
LEFT JOIN devices d
    ON d.id = ud_latest.device_id
WHERE umr.id = ?;