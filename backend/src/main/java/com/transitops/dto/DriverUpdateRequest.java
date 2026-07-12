package com.transitops.dto;

import com.transitops.entity.DriverStatus;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record DriverUpdateRequest(
    @NotBlank(message = "Full name is required.")
    @Size(min = 2, max = 120, message = "Full name must be between 2 and 120 characters.")
    String fullName,

    @NotBlank(message = "License category is required.")
    @Size(max = 50, message = "License category cannot exceed 50 characters.")
    String licenseCategory,

    @NotNull(message = "License expiry date is required.")
    LocalDate licenseExpiry,

    @NotBlank(message = "Phone number is required.")
    @Pattern(regexp = "^[+]?[0-9\\s\\-()]+$", message = "Phone number is invalid.")
    @Size(min = 7, max = 20, message = "Phone number must be between 7 and 20 characters.")
    String phoneNumber,

    @Email(message = "Email is invalid.")
    @Size(max = 100, message = "Email cannot exceed 100 characters.")
    String email,

    @Size(max = 100, message = "Emergency contact cannot exceed 100 characters.")
    String emergencyContact,

    @Min(value = 0, message = "Safety score cannot be negative.")
    @Max(value = 100, message = "Safety score cannot exceed 100.")
    Integer safetyScore,

    DriverStatus status
) {}
