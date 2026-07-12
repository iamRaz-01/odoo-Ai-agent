package com.transitops.dto;

import com.transitops.entity.DriverStatus;

public record DriverStatusResponse(
    Long driverId,
    DriverStatus status
) {}
