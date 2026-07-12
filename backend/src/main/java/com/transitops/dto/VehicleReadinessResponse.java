package com.transitops.dto;

import java.util.List;

public record VehicleReadinessResponse(
    boolean ready,
    boolean insuranceValid,
    boolean fitnessValid,
    boolean pollutionValid,
    boolean fuelAvailable,
    boolean driverAssigned,
    boolean maintenanceCompleted,
    boolean noActiveBreakdown,
    List<String> issues
) {}
