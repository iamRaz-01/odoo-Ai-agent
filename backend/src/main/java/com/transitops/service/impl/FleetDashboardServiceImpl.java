package com.transitops.service.impl;

import com.transitops.dto.AlertResponse;
import com.transitops.dto.FleetDashboardResponse;
import com.transitops.dto.FleetHealthResponse;
import com.transitops.dto.FleetSummaryResponse;
import com.transitops.entity.VehicleDocumentEntity;
import com.transitops.entity.VehicleEntity;
import com.transitops.entity.VehicleStatus;
import com.transitops.repository.VehicleDocumentRepository;
import com.transitops.repository.VehicleRepository;
import com.transitops.service.FleetDashboardService;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class FleetDashboardServiceImpl implements FleetDashboardService {

    private final VehicleRepository vehicleRepository;
    private final VehicleDocumentRepository vehicleDocumentRepository;

    public FleetDashboardServiceImpl(
            VehicleRepository vehicleRepository,
            VehicleDocumentRepository vehicleDocumentRepository) {
        this.vehicleRepository = vehicleRepository;
        this.vehicleDocumentRepository = vehicleDocumentRepository;
    }

    @Override
    public FleetDashboardResponse getFullDashboard() {
        return new FleetDashboardResponse(
                getSummary(),
                getHealth(),
                getUtilization(),
                getDocumentAlerts(),
                getMaintenanceAlerts()
        );
    }

    @Override
    public FleetSummaryResponse getSummary() {
        List<VehicleEntity> vehicles = vehicleRepository.findAll();
        
        long totalFleet = vehicles.size();
        long activeVehicles = vehicles.stream().filter(v -> v.getStatus() != VehicleStatus.RETIRED).count();
        long availableVehicles = vehicles.stream().filter(v -> v.getStatus() == VehicleStatus.AVAILABLE).count();
        long reservedVehicles = vehicles.stream().filter(v -> v.getStatus() == VehicleStatus.RESERVED).count();
        long onTrip = vehicles.stream().filter(v -> v.getStatus() == VehicleStatus.ON_TRIP).count();
        long maintenance = vehicles.stream().filter(v -> v.getStatus() == VehicleStatus.IN_SHOP).count();
        long breakdown = vehicles.stream().filter(v -> v.getStatus() == VehicleStatus.BREAKDOWN).count();
        long retired = vehicles.stream().filter(v -> v.getStatus() == VehicleStatus.RETIRED).count();

        return new FleetSummaryResponse(
                totalFleet,
                activeVehicles,
                availableVehicles,
                reservedVehicles,
                onTrip,
                maintenance,
                breakdown,
                retired
        );
    }

    @Override
    public FleetHealthResponse getHealth() {
        List<VehicleEntity> vehicles = vehicleRepository.findAll();
        long breakdownCount = vehicles.stream().filter(v -> v.getStatus() == VehicleStatus.BREAKDOWN).count();
        
        // Count expired documents (expiry_date < now)
        LocalDate now = LocalDate.now();
        List<VehicleDocumentEntity> allDocuments = vehicleDocumentRepository.findAll();
        long expiredDocumentsCount = allDocuments.stream()
                .filter(d -> d.getExpiryDate().isBefore(now))
                .count();

        long overdueMaintenanceCount = 0; // Not yet implemented (Milestone 3+)

        // Health Score = 100 - breakdownCount - overdueCount - expiredCount
        int score = (int) (100 - breakdownCount - overdueMaintenanceCount - expiredDocumentsCount);
        score = Math.max(0, Math.min(100, score));

        return new FleetHealthResponse(
                score,
                breakdownCount,
                overdueMaintenanceCount,
                expiredDocumentsCount
        );
    }

    @Override
    public double getUtilization() {
        List<VehicleEntity> vehicles = vehicleRepository.findAll();
        long activeVehicles = vehicles.stream().filter(v -> v.getStatus() != VehicleStatus.RETIRED).count();
        if (activeVehicles == 0) {
            return 0.0;
        }
        long onTrip = vehicles.stream().filter(v -> v.getStatus() == VehicleStatus.ON_TRIP).count();
        
        // Utilization = (On Trip Vehicles / Active Vehicles) * 100
        double utilization = ((double) onTrip / activeVehicles) * 100.0;
        // round to 2 decimal places
        return Math.round(utilization * 100.0) / 100.0;
    }

    @Override
    public List<AlertResponse> getDocumentAlerts() {
        LocalDate now = LocalDate.now();
        LocalDate limit = now.plusDays(30);
        
        // Fetch all documents expiring in the next 30 days or already expired
        List<VehicleDocumentEntity> documents = vehicleDocumentRepository.findByExpiryDateBefore(limit);
        List<AlertResponse> alerts = new ArrayList<>();
        
        for (VehicleDocumentEntity doc : documents) {
            boolean isExpired = doc.getExpiryDate().isBefore(now);
            String type = isExpired ? "DOCUMENT_EXPIRED" : "DOCUMENT_EXPIRING";
            String message = isExpired
                    ? String.format("Document '%s' expired on %s", doc.getName(), doc.getExpiryDate())
                    : String.format("Document '%s' is expiring soon on %s", doc.getName(), doc.getExpiryDate());

            alerts.add(new AlertResponse(
                    doc.getId(),
                    type,
                    message,
                    doc.getVehicle().getId(),
                    doc.getVehicle().getRegistrationNumber(),
                    doc.getExpiryDate().toString()
            ));
        }
        return alerts;
    }

    @Override
    public List<AlertResponse> getMaintenanceAlerts() {
        // Placeholder for future Maintenance due integration (Milestone 3+)
        return new ArrayList<>();
    }
}
