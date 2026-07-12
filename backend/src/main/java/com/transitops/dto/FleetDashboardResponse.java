package com.transitops.dto;

import java.util.List;

public record FleetDashboardResponse(
    FleetSummaryResponse summary,
    FleetHealthResponse health,
    double utilization,
    List<AlertResponse> documentAlerts,
    List<AlertResponse> maintenanceAlerts
) {}
