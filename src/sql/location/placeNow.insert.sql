INSERT INTO location_histories (
    user_id,
    latitude,
    longitude,
    place_key,
    place_name,
    recorded_at
)
VALUES (
    ?, ?, ?, ?, ?, NOW()
);
