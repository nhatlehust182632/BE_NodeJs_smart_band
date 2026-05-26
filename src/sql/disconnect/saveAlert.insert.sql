INSERT INTO disconnect_alerts (
    user_id,
    user_device_id,
    last_seen_at,
    message,
    status
)
VALUES (
    ?, ?, ?, ?, ?
);
