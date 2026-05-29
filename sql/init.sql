-- bảng lưu thông tin người dùng
CREATE TABLE users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NULL,
    phone VARCHAR(20) NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    gender TINYINT NULL COMMENT '1=male, 2=female, 3=other',
    date_of_birth DATE NULL,
    height_cm DECIMAL(5,2) NULL,
    weight_kg DECIMAL(5,2) NULL,
    emergency_phone VARCHAR(20) NULL,
    enable_heart_rate_alert TINYINT NOT NULL DEFAULT 1 COMMENT '0=không gửi cảnh báo nhịp tim bất thường, 1=gửi cảnh báo',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '1=active, 2=inactive, 3=blocked',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email),
    UNIQUE KEY uk_users_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- bảng lưu thông tin thiết bị 
CREATE TABLE devices (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    device_name VARCHAR(100) NOT NULL,
    model_name VARCHAR(100) NULL,
    device_id VARCHAR(50) NOT NULL,
    serial_number VARCHAR(100) NULL,
    status TINYINT NOT NULL DEFAULT 1 COMMENT '1=active, 2=inactive, 3=retired',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uk_devices_device_id (device_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- bảng lưu thông tin người dùng - thiết bị
CREATE TABLE user_devices (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    device_id BIGINT UNSIGNED NOT NULL,
    is_primary TINYINT NOT NULL DEFAULT 0 COMMENT '0=không phải thiết bị chính, 1=thiết bị chính',
    pairing_status TINYINT NOT NULL DEFAULT 1 COMMENT '1=paired, 2=unpaired, 3=lost',
    paired_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    unpaired_at DATETIME NULL,

    PRIMARY KEY (id),
    KEY idx_user_devices_user_id (user_id),
    KEY idx_user_devices_device_id (device_id),

    CONSTRAINT fk_user_devices_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_user_devices_device
        FOREIGN KEY (device_id) REFERENCES devices(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- bảng lưu thông tin người dùng - thiết bị - địa chỉ mac
CREATE TABLE user_active_devices (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    device_id BIGINT UNSIGNED NOT NULL,
    mac_address VARCHAR(50) NOT NULL,
    is_connected TINYINT NOT NULL DEFAULT 1 COMMENT '0=đã ngắt kết nối, 1=đang kết nối',
    connected_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_seen_at DATETIME NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uk_user_active_device_user (user_id),
    KEY idx_user_active_device_device_id (device_id),

    CONSTRAINT fk_user_active_devices_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_user_active_devices_device
        FOREIGN KEY (device_id) REFERENCES devices(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- bảng lưu thông tin người dùng - nhịp tim
CREATE TABLE user_health (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_device_id BIGINT UNSIGNED NOT NULL,
    heart_rate INT NULL,
    spo2 INT NULL,
    temperature DECIMAL(4,1) NULL,
    recorded_at DATETIME NOT NULL,

    PRIMARY KEY (id),
    KEY idx_user_health_device_time (user_device_id, recorded_at),

    CONSTRAINT fk_user_health_user_device
        FOREIGN KEY (user_device_id) REFERENCES user_devices(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- bảng lưu cảnh báo người dùng - rung nhĩ
CREATE TABLE atrial_fibrillation_alerts (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    threshold_value DECIMAL(10,3) NULL,
    message VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),

    KEY idx_af_alerts_user_id (user_id),

    CONSTRAINT fk_af_alerts_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- bảng lưu thông tin bị ngắt kết nối với thiết bị
CREATE TABLE disconnect_alerts (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    user_device_id BIGINT UNSIGNED NOT NULL,
    last_seen_at DATETIME NULL,
    message VARCHAR(255) NULL,
    status TINYINT NOT NULL DEFAULT 1 COMMENT '1=new, 2=seen, 3=resolved',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_disconnect_alerts_user_id (user_id),
    KEY idx_disconnect_alerts_status (status),

    CONSTRAINT fk_disconnect_alerts_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_disconnect_alerts_user_device
        FOREIGN KEY (user_device_id) REFERENCES user_devices(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- bảng lưu thông tin người dùng - số bước chân
CREATE TABLE step_counts (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    steps INT NOT NULL DEFAULT 0,
    distance_m DECIMAL(10,2) NULL,
    calories DECIMAL(10,2) NULL,
    recorded_date DATE NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uk_step_counts_user_date (user_id, recorded_date),
    
    CONSTRAINT fk_step_counts_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- bảng lưu thông tin vị trí người dùng
CREATE TABLE location_histories (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    place_key VARCHAR(50) NULL
    COMMENT 'Key gom các vị trí gần nhau để query top location',
    place_name VARCHAR(255) NULL,
    recorded_at DATETIME NOT NULL,
    PRIMARY KEY (id),

    KEY idx_location_user_time (user_id, recorded_at),
    KEY idx_location_place_key (place_key),

    CONSTRAINT fk_location_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- bảng lưu thông tin giám sát người dùng
CREATE TABLE user_monitor_relations (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    monitor_user_id BIGINT UNSIGNED NOT NULL,
    target_user_id BIGINT UNSIGNED NOT NULL,
    relationship_type TINYINT NOT NULL DEFAULT 8 COMMENT '1=parent, 2=child, 3=spouse, 4=doctor, 5=caregiver, 6=friend, 7=trainer, 8=other',
    permission_level TINYINT NOT NULL DEFAULT 1 COMMENT '1=read_only, 2=read_alerts_only, 3=full_view',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '1=pending, 2=accepted, 3=rejected, 4=revoked',
    allow_send_alert TINYINT NOT NULL DEFAULT 1 COMMENT '0=không đồng ý gửi cảnh báo cho người thân, 1=đồng ý gửi cảnh báo cho người thân',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uk_monitor_target (monitor_user_id, target_user_id),
    KEY idx_monitor_user (monitor_user_id),
    KEY idx_target_user (target_user_id),
    KEY idx_monitor_status (status),

    CONSTRAINT fk_monitor_user
        FOREIGN KEY (monitor_user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_target_user
        FOREIGN KEY (target_user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- bảng lưu cảnh báo pin yếu thiết bị
CREATE TABLE device_battery_logs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_device_id BIGINT UNSIGNED NOT NULL,
    battery_percent INT NOT NULL,
    is_charging TINYINT NOT NULL DEFAULT 0 COMMENT '0=không sạc, 1=đang sạc',
    recorded_at DATETIME NOT NULL,

    PRIMARY KEY (id),
    KEY idx_battery_device_time (user_device_id, recorded_at),

    CONSTRAINT fk_battery_user_device
        FOREIGN KEY (user_device_id) REFERENCES user_devices(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;