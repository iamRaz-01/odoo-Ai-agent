package com.transitops.controller;

import com.transitops.dto.AlertResponse;
import com.transitops.dto.ApiResponse;
import com.transitops.dto.FleetDashboardResponse;
import com.transitops.dto.FleetHealthResponse;
import com.transitops.dto.FleetSummaryResponse;
import com.transitops.service.FleetDashboardService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/fleet/dashboard")
@PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'DISPATCHER', 'FINANCE_OFFICER', 'SAFETY_OFFICER')")
public class FleetDashboardController {

    private final FleetDashboardService fleetDashboardService;

    public FleetDashboardController(FleetDashboardService fleetDashboardService) {
        this.fleetDashboardService = fleetDashboardService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<FleetDashboardResponse>> getFullDashboard() {
        return ResponseEntity.ok(ApiResponse.success("Fleet dashboard data retrieved.", fleetDashboardService.getFullDashboard()));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<FleetSummaryResponse>> getSummary() {
        return ResponseEntity.ok(ApiResponse.success("Fleet summary retrieved.", fleetDashboardService.getSummary()));
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<FleetHealthResponse>> getHealth() {
        return ResponseEntity.ok(ApiResponse.success("Fleet health retrieved.", fleetDashboardService.getHealth()));
    }

    @GetMapping("/utilization")
    public ResponseEntity<ApiResponse<Double>> getUtilization() {
        return ResponseEntity.ok(ApiResponse.success("Fleet utilization retrieved.", fleetDashboardService.getUtilization()));
    }

    @GetMapping("/documents")
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getDocumentAlerts() {
        return ResponseEntity.ok(ApiResponse.success("Fleet document alerts retrieved.", fleetDashboardService.getDocumentAlerts()));
    }

    @GetMapping("/maintenance")
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getMaintenanceAlerts() {
        return ResponseEntity.ok(ApiResponse.success("Fleet maintenance alerts retrieved.", fleetDashboardService.getMaintenanceAlerts()));
    }
}
