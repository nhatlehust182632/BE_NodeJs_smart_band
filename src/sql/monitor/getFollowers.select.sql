SELECT
    umr.id,
    umr.monitor_user_id AS user_id,
    u.full_name AS name,
    u.phone,
    umr.relationship_type,
    umr.permission_level,
    umr.status,
    DATE_FORMAT(umr.updated_at, '%d/%m/%Y %H:%i') AS joinedAt
FROM user_monitor_relations umr
JOIN users u ON u.id = umr.monitor_user_id
WHERE umr.target_user_id = ?
  AND umr.status = 2
ORDER BY umr.updated_at DESC;