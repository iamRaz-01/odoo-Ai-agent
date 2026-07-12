package com.transitops.dto;

import com.transitops.entity.VehicleStatus;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record VehicleUpdateRequest(
    @NotNull(message = "Vehicle type is required.")
    Long vehicleTypeId,

    @NotNull(message = "Capacity is required.")
    @DecimalMin(value = "0.01", message = "Capacity must be greater than zero.")
    BigDecimal capacity,

    @NotNull(message = "Acquisition cost is required.")
    @DecimalMin(value = "0.01", message = "Acquisition cost must be positive.")
    BigDecimal acquisitionCost,

    @NotNull(message = "Odometer is required.")
    @DecimalMin(value = "0.00", message = "Odometer cannot be negative.")
    BigDecimal odometer,

    @NotNull(message = "Status is required.")
    VehicleStatus status,

    @Size(max = 100, message = "Name cannot exceed 100 characters.")
    String name,

    @Size(max = 100, message = "Model cannot exceed 100 characters.")
    String model,

    @Size(max = 50, message = "Fuel type cannot exceed 50 characters.")
    String fuelType,

    @Min(value = 1900, message = "Manufacturing year must be after 1900.")
    @Max(value = 2100, message = "Manufacturing year must be realistic.")
    Integer manufacturingYear,

    @Size(max = 100, message = "Engine number cannot exceed 100 characters.")
    String engineNumber,

    @Size(max = 100, message = "Chassis number cannot exceed 100 characters.")
    String chassisNumber,

    @Size(max = 100, message = "Assigned depot cannot exceed 100 characters.")
    String assignedDepot,

    @DecimalMin(value = "0.00", message = "Maximum capacity cannot be negative.")
    BigDecimal maximumCapacity,

    Long driverId,

    @DecimalMin(value = "0.00", message = "Fuel level cannot be negative.")
    @DecimalMax(value = "100.00", message = "Fuel level cannot exceed 100%.")
    BigDecimal fuelLevel
) {
    // Alternate constructor for backward compatibility
    public VehicleUpdateRequest(
            Long vehicleTypeId,
            BigDecimal capacity,
            BigDecimal acquisitionCost,
            BigDecimal odometer,
            VehicleStatus status) {
        this(vehicleTypeId, capacity, acquisitionCost, odometer, status,
             null, null, null, null, null, null, null, null, null, null);
    }
}
