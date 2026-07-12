package com.transitops.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record TripRequest(
    @NotBlank(message = "Trip name is required.")
    @Size(max = 100, message = "Trip name cannot exceed 100 characters.")
    String tripName,

    String description,

    @NotBlank(message = "Priority is required.")
    String priority,

    @NotBlank(message = "Source is required.")
    @Size(max = 150, message = "Source location cannot exceed 150 characters.")
    String source,

    @NotBlank(message = "Destination is required.")
    @Size(max = 150, message = "Destination location cannot exceed 150 characters.")
    String destination,

    @NotBlank(message = "Cargo type is required.")
    @Size(max = 100, message = "Cargo type cannot exceed 100 characters.")
    String cargoType,

    @NotNull(message = "Cargo weight is required.")
    @Positive(message = "Cargo weight must be positive.")
    BigDecimal cargoWeight,

    @NotNull(message = "Planned date is required.")
    LocalDate plannedDate,

    @NotNull(message = "Planned time is required.")
    LocalTime plannedTime,

    Long vehicleId,
    Long driverId
) {}
