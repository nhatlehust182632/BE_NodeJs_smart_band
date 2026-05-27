SELECT
    umr.id,
    umr.monitor_user_id AS user_id,
    u.full_name,
    u.phone,
    umr.relationship_type,
    umr.permission_level,
    umr.status,
    umr.created_at
FROM user_monitor_relations umr
JOIN users u ON u.id = umr.monitor_user_id
WHERE umr.target_user_id = ?
  AND umr.status = 1
ORDER BY umr.created_at DESC;
