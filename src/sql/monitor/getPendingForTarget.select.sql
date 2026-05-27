SELECT
    umr.id,
    umr.monitor_user_id AS user_id,
    u.full_name AS requesterName,
    u.phone AS requesterPhone,
    umr.relationship_type,
    umr.permission_level,
    CASE umr.status
        WHEN 1 THEN 'Chờ xác nhận'
        WHEN 2 THEN 'Đã đồng ý'
        WHEN 3 THEN 'Đã từ chối'
        WHEN 4 THEN 'Đã thu hồi'
        ELSE 'Không xác định'
    END AS status,
    DATE_FORMAT(umr.created_at, '%d/%m/%Y %H:%i') AS requestedAt
FROM user_monitor_relations umr
JOIN users u ON u.id = umr.monitor_user_id
WHERE umr.target_user_id = ?
  AND umr.status = 1
ORDER BY umr.created_at DESC;