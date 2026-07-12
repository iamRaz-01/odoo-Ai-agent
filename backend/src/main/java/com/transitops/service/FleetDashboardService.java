package com.transitops.service;

import com.transitops.dto.AlertResponse;
import com.transitops.dto.FleetDashboardResponse;
import com.transitops.dto.FleetHealthResponse;
import com.transitops.dto.FleetSummaryResponse;
import java.util.List;

public interface FleetDashboardService {
    FleetDashboardResponse getFullDashboard();
    FleetSummaryResponse getSummary();
    FleetHealthResponse getHealth();
    double getUtilization();
    List<AlertResponse> getDocumentAlerts();
    List<AlertResponse> getMaintenanceAlerts();
}
