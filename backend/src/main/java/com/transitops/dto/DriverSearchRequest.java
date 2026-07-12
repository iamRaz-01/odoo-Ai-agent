package com.transitops.dto;

import com.transitops.entity.DriverStatus;
import java.time.LocalDate;

public record DriverSearchRequest(
    String name,
    String licenseNumber,
    DriverStatus status,
    String licenseCategory,
    Integer minSafetyScore,
    LocalDate licenseExpiryBefore,
    LocalDate licenseExpiryAfter
) {}
