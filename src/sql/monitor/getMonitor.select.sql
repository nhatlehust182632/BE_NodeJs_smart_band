SELECT
    umr.id AS id,
    u.full_name as name,
    u.age,
    umr.note as relation,
    umr.status as isConnected,
	if(hr.quality_score > 130, 'Cảnh báo', 'Bình thường') as status,
    hr.quality_score AS heartRate,
	loc_latest.place_name as location
FROM user_monitor_relations umr
JOIN users u
    ON u.id = umr.target_user_id
JOIN user_devices ud
    ON ud.user_id = u.id
   AND ud.pairing_status = 'paired'
LEFT JOIN devices d
    ON d.id = ud.device_id
LEFT JOIN heart_rate_records hr
    ON hr.id = (
        SELECT hr2.id
        FROM heart_rate_records hr2
        WHERE hr2.user_device_id = ud.id
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
WHERE umr.monitor_user_id = ?
  AND umr.status = 'accepted'
ORDER BY u.full_name ASC;


