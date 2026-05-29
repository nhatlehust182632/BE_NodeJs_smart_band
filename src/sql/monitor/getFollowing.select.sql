SELECT
    umr.id,
    umr.target_user_id AS user_id,
    u.full_name AS name,
    u.phone,
    TIMESTAMPDIFF(YEAR, u.date_of_birth, CURDATE()) AS age,
    CASE umr.relationship_type
        WHEN 1 THEN 'Cha/Mẹ'
        WHEN 2 THEN 'Con'
        WHEN 3 THEN 'Vợ/Chồng'
        WHEN 4 THEN 'Bác sĩ'
        WHEN 5 THEN 'Người chăm sóc'
        WHEN 6 THEN 'Bạn bè'
        WHEN 7 THEN 'Huấn luyện viên'
        ELSE 'Khác'
    END AS relation,
    umr.permission_level,
    umr.status,
    umr.created_at
FROM user_monitor_relations umr
JOIN users u ON u.id = umr.target_user_id
WHERE umr.monitor_user_id = ?
  AND umr.status = 2
ORDER BY umr.created_at DESC;