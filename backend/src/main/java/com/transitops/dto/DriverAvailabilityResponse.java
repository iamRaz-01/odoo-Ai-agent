package com.transitops.dto;

public record DriverAvailabilityResponse(
    Long driverId,
    boolean available,
    String reason
) {}
