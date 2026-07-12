-- V5__extend_vehicle_schema.sql
-- Extend vehicle table with additional enterprise fields, driver mapping, fuel level tracking, and new status constraints.

ALTER TABLE vehicle
ADD COLUMN name VARCHAR(100) NULL,
ADD COLUMN model VARCHAR(100) NULL,
ADD COLUMN fuel_type VARCHAR(50) NULL,
ADD COLUMN manufacturing_year INT NULL,
ADD COLUMN engine_number VARCHAR(100) NULL,
ADD COLUMN chassis_number VARCHAR(100) NULL,
ADD COLUMN assigned_depot VARCHAR(100) NULL,
ADD COLUMN maximum_capacity DECIMAL(10,2) NULL,
ADD COLUMN driver_id BIGINT NULL,
ADD COLUMN fuel_level DECIMAL(5,2) NULL;

-- Drop old check constraint and recreate with new lifecycle statuses
ALTER TABLE vehicle DROP CONSTRAINT chk_vehicle_status;
ALTER TABLE vehicle ADD CONSTRAINT chk_vehicle_status CHECK (
    status IN (
        'AVAILABLE', 'RESERVED', 'ON_TRIP', 'IN_SHOP', 'BREAKDOWN', 'RETIRED',
        'PURCHASED', 'REGISTERED', 'ACTIVE', 'ASSIGNED', 'MAINTENANCE', 'RETURNED', 'DECOMMISSIONED'
    )
);
