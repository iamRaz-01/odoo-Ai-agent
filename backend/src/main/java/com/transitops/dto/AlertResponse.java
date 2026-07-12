package com.transitops.dto;

public record AlertResponse(
    Long id,
    String type,
    String message,
    Long vehicleId,
    String registrationNumber,
    String details
) {}
