INSERT INTO user_monitor_relations (
    monitor_user_id,
    target_user_id,
    relationship_type,
    permission_level,
    status,
    allow_send_alert
)
VALUES (?, ?, ?, ?, 1, 1)
ON DUPLICATE KEY UPDATE
    relationship_type = VALUES(relationship_type),
    permission_level = VALUES(permission_level),
    status = 1,
    updated_at = CURRENT_TIMESTAMP;
