package com.transitops.dto;

import com.transitops.entity.DriverStatus;
import java.time.Instant;
import java.time.LocalDate;

public record DriverResponse(
    Long id,
    String fullName,
    String licenseNumber,
    String licenseCategory,
    LocalDate licenseExpiry,
    String phoneNumber,
    String email,
    String emergencyContact,
    Integer safetyScore,
    DriverStatus status,
    Instant createdAt,
    Instant updatedAt
) {}
