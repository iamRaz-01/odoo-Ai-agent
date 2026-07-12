package com.transitops.dto;

public record FleetHealthResponse(
    int score,
    long breakdownCount,
    long overdueMaintenanceCount,
    long expiredDocumentsCount
) {}
