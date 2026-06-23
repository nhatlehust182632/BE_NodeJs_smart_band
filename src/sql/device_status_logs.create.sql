CREATE TABLE device_status_logs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_device_id BIGINT UNSIGNED NOT NULL,

    event_type TINYINT UNSIGNED NOT NULL
        COMMENT 'Event Type 4 bit',

    cycle_id TINYINT UNSIGNED NOT NULL
        COMMENT 'Cycle ID 7 bit, giá trị 0-127',

    packet_index TINYINT UNSIGNED NOT NULL
        COMMENT 'Packet Index 5 bit, giá trị 0-31',

    ble_status TINYINT UNSIGNED NOT NULL,
    imu_status TINYINT UNSIGNED NOT NULL,
    ppg_status TINYINT UNSIGNED NOT NULL,
    gauge_status TINYINT UNSIGNED NOT NULL,
    gnss_status TINYINT UNSIGNED NOT NULL,
    lte_status TINYINT UNSIGNED NOT NULL,

    raw_byte_7 TINYINT UNSIGNED NOT NULL,
    raw_byte_8 TINYINT UNSIGNED NOT NULL,
    raw_byte_9 TINYINT UNSIGNED NOT NULL,
    raw_byte_10 TINYINT UNSIGNED NOT NULL,
    raw_byte_11 TINYINT UNSIGNED NOT NULL,

    raw_packet_hex VARCHAR(255) NULL,
    recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    KEY idx_device_status_time (
        user_device_id,
        recorded_at
    ),

    KEY idx_device_status_cycle_packet (
        user_device_id,
        cycle_id,
        packet_index
    ),

    CONSTRAINT fk_device_status_user_device
        FOREIGN KEY (user_device_id)
        REFERENCES user_devices(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_device_status_event_type
        CHECK (event_type = 2),

    CONSTRAINT chk_device_status_cycle_id
        CHECK (cycle_id BETWEEN 0 AND 127),

    CONSTRAINT chk_device_status_packet_index
        CHECK (packet_index BETWEEN 0 AND 31)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;