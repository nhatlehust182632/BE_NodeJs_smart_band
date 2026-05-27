UPDATE user_monitor_relations
SET status = 2,
    updated_at = CURRENT_TIMESTAMP
WHERE id = ?
  AND target_user_id = ?
  AND status = 1;
