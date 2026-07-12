package com.transitops.dto;

import com.transitops.entity.VehicleStatus;
import java.math.BigDecimal;
import java.time.Instant;

public record VehicleResponse(
    Long id,
    String registrationNumber,
    VehicleTypeResponse vehicleType,
    BigDecimal capacity,
    BigDecimal acquisitionCost,
    BigDecimal odometer,
    VehicleStatus status,
    String name,
    String model,
    String fuelType,
    Integer manufacturingYear,
    String engineNumber,
    String chassisNumber,
    String assignedDepot,
    BigDecimal maximumCapacity,
    Long driverId,
    BigDecimal fuelLevel,
    Instant createdAt,
    Instant updatedAt
) {
    // Alternate constructor for backward compatibility
    public VehicleResponse(
            Long id,
            String registrationNumber,
            VehicleTypeResponse vehicleType,
            BigDecimal capacity,
            BigDecimal acquisitionCost,
            BigDecimal odometer,
            VehicleStatus status,
            Instant createdAt,
            Instant updatedAt) {
        this(id, registrationNumber, vehicleType, capacity, acquisitionCost, odometer, status,
             null, null, null, null, null, null, null, null, null, null, createdAt, updatedAt);
    }
}
