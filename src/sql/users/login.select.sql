SELECT u.id, u.full_name, d.device_code FROM users as u
left join user_devices as ud ON u.id = ud.user_id and ud.pairing_status = 'paired'
inner join devices as d ON d.id = ud.device_id
WHERE u.id = ? AND u.password_hash = ?;