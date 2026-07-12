package com.transitops.dto;

public record FleetSummaryResponse(
    long totalFleet,
    long activeVehicles,
    long availableVehicles,
    long reservedVehicles,
    long onTrip,
    long maintenance,
    long breakdown,
    long retired
) {}
