CREATE TABLE vehicle_type (
    vehicle_type_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_vehicle_type_name UNIQUE (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE vehicle (
    vehicle_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_type_id BIGINT NOT NULL,
    registration_number VARCHAR(50) NOT NULL,
    capacity DECIMAL(10,2) NOT NULL,
    acquisition_cost DECIMAL(15,2) NOT NULL,
    odometer DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    CONSTRAINT uk_vehicle_registration UNIQUE (registration_number),
    CONSTRAINT chk_vehicle_capacity CHECK (capacity > 0),
    CONSTRAINT chk_vehicle_acquisition_cost CHECK (acquisition_cost > 0),
    CONSTRAINT chk_vehicle_odometer CHECK (odometer >= 0),
    CONSTRAINT chk_vehicle_status CHECK (status IN ('AVAILABLE', 'RESERVED', 'ON_TRIP', 'IN_SHOP', 'BREAKDOWN', 'RETIRED')),
    CONSTRAINT fk_vehicle_vehicle_type FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_type(vehicle_type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE vehicle_document (
    vehicle_document_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    document_number VARCHAR(100) NOT NULL,
    expiry_date DATE NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    CONSTRAINT fk_vehicle_document_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicle(vehicle_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_vehicle_status ON vehicle(status);
CREATE INDEX idx_vehicle_type ON vehicle(vehicle_type_id);
CREATE INDEX idx_vehicle_status_type ON vehicle(status, vehicle_type_id);
CREATE INDEX idx_vehicle_document_vehicle ON vehicle_document(vehicle_id);

INSERT INTO vehicle_type (name, description) VALUES
  ('TRUCK', 'Truck'),
  ('VAN', 'Van'),
  ('BUS', 'Bus'),
  ('TRAILER', 'Trailer'),
  ('MINI_TRUCK', 'Mini Truck');
