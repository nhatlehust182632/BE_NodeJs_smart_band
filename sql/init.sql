CREATE DATABASE smartband_db;
USE smartband_db;

-- demo
CREATE TABLE sensor_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    heart_rate INT,
    spo2 INT,
    steps INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
select * From sensor_data;

-- bang luu thong tin thiet bi
CREATE TABLE users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NULL,
    phone VARCHAR(20) NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    gender ENUM('male', 'female', 'other') NULL,
    date_of_birth DATE NULL,
    age INT NULL,
    emergency_contact_name VARCHAR(150) NULL,
    emergency_contact_phone VARCHAR(20) NULL,
    height_cm DECIMAL(5,2) NULL,
    weight_kg DECIMAL(5,2) NULL,
    timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Bangkok',
    language VARCHAR(10) NOT NULL DEFAULT 'vi',
    status ENUM('active', 'blocked', 'inactive') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email),
    UNIQUE KEY uk_users_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE devices (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    device_code VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    mac_address VARCHAR(50) NULL,
    firmware_version VARCHAR(50) NULL,
    battery_level TINYINT UNSIGNED NULL,
    last_seen_at DATETIME NULL,
    status ENUM('active', 'inactive', 'retired') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uk_devices_device_code (device_code),
    UNIQUE KEY uk_devices_serial_number (serial_number),
    UNIQUE KEY uk_devices_mac_address (mac_address),
    KEY idx_devices_last_seen_at (last_seen_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_devices (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    device_id BIGINT UNSIGNED NOT NULL,
    paired_at DATETIME NOT NULL,
    unpaired_at DATETIME NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    pairing_status ENUM('paired', 'unpaired', 'lost') NOT NULL DEFAULT 'paired',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_user_devices_user_id (user_id),
    KEY idx_user_devices_device_id (device_id),
    KEY idx_user_devices_pairing_status (pairing_status),
    KEY idx_user_devices_user_device (user_id, device_id),

    CONSTRAINT fk_user_devices_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_user_devices_device
        FOREIGN KEY (device_id) REFERENCES devices(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE heart_rate_records (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_device_id BIGINT UNSIGNED NOT NULL,
    measured_at DATETIME NOT NULL,
    bpm SMALLINT UNSIGNED NOT NULL,
    source ENUM('sensor', 'manual', 'api') NOT NULL DEFAULT 'sensor',
    quality_score TINYINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_hr_user_device_id (user_device_id),
    KEY idx_hr_measured_at (measured_at),
    KEY idx_hr_user_measured_at (user_device_id, measured_at),
	
	CONSTRAINT fk_hr_user_devices
        FOREIGN KEY (user_device_id) REFERENCES user_devices(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE step_records (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_device_id BIGINT UNSIGNED NOT NULL,
    recorded_at DATETIME NOT NULL,
    steps INT UNSIGNED NOT NULL DEFAULT 0,
    distance_m DECIMAL(10,2) NULL DEFAULT 0,
    calories_burned DECIMAL(10,2) NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_step_user_device_id (user_device_id),
    KEY idx_step_recorded_at (recorded_at),
    KEY idx_step_user_recorded_at (user_device_id, recorded_at),
	
    CONSTRAINT fk_step_user_devices
        FOREIGN KEY (user_device_id) REFERENCES user_devices(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE sleep_sessions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_device_id BIGINT UNSIGNED NOT NULL,
    sleep_start DATETIME NOT NULL,
    sleep_end DATETIME NOT NULL,
    total_minutes INT UNSIGNED NOT NULL DEFAULT 0,
    deep_minutes INT UNSIGNED NOT NULL DEFAULT 0,
    light_minutes INT UNSIGNED NOT NULL DEFAULT 0,
    rem_minutes INT UNSIGNED NOT NULL DEFAULT 0,
    awake_minutes INT UNSIGNED NOT NULL DEFAULT 0,
    sleep_score TINYINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_sleep_user_device_id (user_device_id),
    KEY idx_sleep_start (sleep_start),
    KEY idx_sleep_user_start (user_device_id, sleep_start),

    CONSTRAINT fk_sleep_user_devices
        FOREIGN KEY (user_device_id) REFERENCES user_devices(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE daily_health_summaries (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    summary_date DATE NOT NULL,
    total_steps INT UNSIGNED NOT NULL DEFAULT 0,
    total_distance_m DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_calories_burned DECIMAL(10,2) NOT NULL DEFAULT 0,
    avg_heart_rate DECIMAL(5,2) NULL,
    resting_heart_rate SMALLINT UNSIGNED NULL,
    total_sleep_minutes INT UNSIGNED NOT NULL DEFAULT 0,
    sleep_score TINYINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uk_daily_summary_user_date (user_id, summary_date),
    KEY idx_daily_summary_date (summary_date),

    CONSTRAINT fk_daily_summary_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE health_alerts (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_device_id BIGINT UNSIGNED NOT NULL,
    alert_type ENUM('high_hr', 'low_hr', 'low_activity', 'poor_sleep', 'device_offline', 'other') NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'low',
    alert_message VARCHAR(500) NOT NULL,
    detected_at DATETIME NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    resolved_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_alerts_user_device_id (user_device_id),
    KEY idx_alerts_detected_at (detected_at),
    KEY idx_alerts_user_read (user_device_id, is_read),
    KEY idx_alerts_user_resolved (user_device_id, is_resolved),

    CONSTRAINT fk_alerts_user_devices
        FOREIGN KEY (user_device_id) REFERENCES user_devices(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_monitor_relations (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    monitor_user_id BIGINT UNSIGNED NOT NULL,
    target_user_id BIGINT UNSIGNED NOT NULL,
    relationship_type ENUM('parent', 'child', 'spouse', 'doctor', 'caregiver', 'friend', 'trainer', 'other') NOT NULL DEFAULT 'other',
    permission_level ENUM('read_only', 'read_alerts_only', 'full_view') NOT NULL DEFAULT 'read_only',
    status ENUM('pending', 'accepted', 'rejected', 'revoked') NOT NULL DEFAULT 'pending',
    invited_by_user_id BIGINT UNSIGNED NULL,
    invited_at DATETIME NULL,
    responded_at DATETIME NULL,
    revoked_at DATETIME NULL,
    note VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uk_monitor_target (monitor_user_id, target_user_id),
    KEY idx_umr_monitor_user (monitor_user_id),
    KEY idx_umr_target_user (target_user_id),
    KEY idx_umr_status (status),
    KEY idx_umr_target_status (target_user_id, status),
    KEY idx_umr_monitor_status (monitor_user_id, status),

    CONSTRAINT fk_umr_monitor_user
        FOREIGN KEY (monitor_user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_umr_target_user
        FOREIGN KEY (target_user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_umr_invited_by_user
        FOREIGN KEY (invited_by_user_id) REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;