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
    Instant createdAt,
    Instant updatedAt
) {}
