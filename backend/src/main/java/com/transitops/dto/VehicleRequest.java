package com.transitops.dto;

import com.transitops.entity.VehicleStatus;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record VehicleRequest(
    @NotBlank(message = "Registration number is required.")
    @Size(max = 50, message = "Registration number cannot exceed 50 characters.")
    String registrationNumber,

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
