package com.transitops.dto;

public record TripAssignRequest(
    Long driverId,
    Long vehicleId
) {}
