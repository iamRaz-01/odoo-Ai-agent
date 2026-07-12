CREATE TABLE trip (
    trip_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_number VARCHAR(50) NOT NULL UNIQUE,
    trip_name VARCHAR(100) NOT NULL,
    description TEXT,
    priority VARCHAR(20) NOT NULL,
    source VARCHAR(150) NOT NULL,
    destination VARCHAR(150) NOT NULL,
    cargo_type VARCHAR(100) NOT NULL,
    cargo_weight DECIMAL(10, 2) NOT NULL,
    planned_date DATE NOT NULL,
    planned_time TIME NOT NULL,
    vehicle_id BIGINT NULL,
    driver_id BIGINT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    created_by_user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    CONSTRAINT fk_trip_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicle(vehicle_id),
    CONSTRAINT fk_trip_driver FOREIGN KEY (driver_id) REFERENCES driver(driver_id),
    CONSTRAINT fk_trip_user FOREIGN KEY (created_by_user_id) REFERENCES user(user_id)
);

CREATE INDEX idx_trip_status ON trip(status);
CREATE INDEX idx_trip_driver_status ON trip(driver_id, status);
CREATE INDEX idx_trip_vehicle_status ON trip(vehicle_id, status);
CREATE INDEX idx_trip_created_by ON trip(created_by_user_id);
