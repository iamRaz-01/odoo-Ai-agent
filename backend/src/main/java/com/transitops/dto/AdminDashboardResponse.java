package com.transitops.dto;

import java.util.List;
import java.util.Map;

public record AdminDashboardResponse(
    long totalUsers,
    long totalVehicles,
    long availableVehicles,
    long totalDrivers,
    long totalTrips,
    long activeTrips,
    long fuelLogsCount,
    long expensesCount,
    long maintenanceCount,
    Map<String, Long> roleCounts,
    List<RecentActivityResponse> recentActivity
) {}
