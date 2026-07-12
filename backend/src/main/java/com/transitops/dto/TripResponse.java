package com.transitops.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

public record TripResponse(
    Long id,
    String tripNumber,
    String tripName,
    String description,
    String priority,
    String source,
    String destination,
    String cargoType,
    BigDecimal cargoWeight,
    LocalDate plannedDate,
    LocalTime plannedTime,
    Long vehicleId,
    String vehicleRegistrationNumber,
    Long driverId,
    String driverName,
    String status,
    Long createdByUserId,
    String createdByUserName,
    Instant createdAt,
    Instant updatedAt
) {}
