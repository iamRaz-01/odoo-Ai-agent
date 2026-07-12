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
    VehicleStatus status
) {}
