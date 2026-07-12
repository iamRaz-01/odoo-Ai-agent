package com.transitops.dto;

import java.util.Map;

public record FleetAnalyticsResponse(
    double utilizationRate,
    double averageFuelEfficiency,
    double downtimeRate,
    double totalMaintenanceCost,
    double totalDistanceCovered,
    double averageIdleTimeHours,
    Map<String, Long> lifecycleDistribution
) {}
