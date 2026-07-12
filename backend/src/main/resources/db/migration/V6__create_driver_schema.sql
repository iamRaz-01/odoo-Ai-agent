CREATE TABLE driver (
    driver_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    license_number VARCHAR(50) NOT NULL,
    license_category VARCHAR(50) NOT NULL,
    license_expiry DATE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(100) NULL,
    emergency_contact VARCHAR(100) NULL,
    safety_score INT NOT NULL DEFAULT 100,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    CONSTRAINT uk_driver_license UNIQUE (license_number),
    CONSTRAINT chk_driver_status CHECK (status IN ('AVAILABLE', 'ASSIGNED', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED', 'INACTIVE')),
    CONSTRAINT chk_driver_safety_score CHECK (safety_score BETWEEN 0 AND 100)
);

CREATE INDEX idx_driver_status_expiry ON driver (status, license_expiry);
CREATE INDEX idx_driver_license_number ON driver (license_number);
