package com.transitops.service.impl;

import com.transitops.dto.VehicleReadinessResponse;
import com.transitops.entity.VehicleDocumentEntity;
import com.transitops.entity.VehicleEntity;
import com.transitops.entity.VehicleStatus;
import com.transitops.exception.VehicleNotFoundException;
import com.transitops.repository.VehicleDocumentRepository;
import com.transitops.repository.VehicleRepository;
import com.transitops.service.FleetReadinessService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class FleetReadinessServiceImpl implements FleetReadinessService {

    private final VehicleRepository vehicleRepository;
    private final VehicleDocumentRepository documentRepository;

    public FleetReadinessServiceImpl(VehicleRepository vehicleRepository, VehicleDocumentRepository documentRepository) {
        this.vehicleRepository = vehicleRepository;
        this.documentRepository = documentRepository;
    }

    @Override
    public VehicleReadinessResponse checkReadiness(Long vehicleId) {
        VehicleEntity vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new VehicleNotFoundException(vehicleId));

        List<VehicleDocumentEntity> docs = documentRepository.findByVehicleId(vehicleId);
        LocalDate today = LocalDate.now();

        boolean insuranceValid = false;
        boolean fitnessValid = false;
        boolean pollutionValid = false;

        for (VehicleDocumentEntity doc : docs) {
            String docName = doc.getName().toUpperCase();
            boolean isExpired = doc.getExpiryDate().isBefore(today);
            if (docName.contains("INSURANCE")) {
                insuranceValid = !isExpired;
            } else if (docName.contains("FITNESS")) {
                fitnessValid = !isExpired;
            } else if (docName.contains("POLLUTION")) {
                pollutionValid = !isExpired;
            }
        }

        boolean fuelAvailable = vehicle.getFuelLevel() != null && vehicle.getFuelLevel().compareTo(BigDecimal.valueOf(15.0)) > 0;
        boolean driverAssigned = vehicle.getDriverId() != null;
        
        // Maintenance Completed check (must not be in shop/maintenance status)
        boolean maintenanceCompleted = vehicle.getStatus() != VehicleStatus.MAINTENANCE 
            && vehicle.getStatus() != VehicleStatus.IN_SHOP;
            
        // No Active Breakdown check
        boolean noActiveBreakdown = vehicle.getStatus() != VehicleStatus.BREAKDOWN;

        List<String> issues = new ArrayList<>();
        if (!insuranceValid) issues.add("Missing or expired Insurance Certificate.");
        if (!fitnessValid) issues.add("Missing or expired Fitness Certificate.");
        if (!pollutionValid) issues.add("Missing or expired Pollution Certificate.");
        if (!fuelAvailable) {
            issues.add(vehicle.getFuelLevel() == null 
                ? "No fuel level telemetry reported." 
                : String.format("Low fuel: %s%% (Target: >15%%)", vehicle.getFuelLevel()));
        }
        if (!driverAssigned) issues.add("No driver assigned to this vehicle.");
        if (!maintenanceCompleted) issues.add("Vehicle is currently undergoing maintenance.");
        if (!noActiveBreakdown) issues.add("Vehicle is in breakdown status.");

        boolean ready = insuranceValid && fitnessValid && pollutionValid && fuelAvailable 
            && driverAssigned && maintenanceCompleted && noActiveBreakdown;

        return new VehicleReadinessResponse(
            ready,
            insuranceValid,
            fitnessValid,
            pollutionValid,
            fuelAvailable,
            driverAssigned,
            maintenanceCompleted,
            noActiveBreakdown,
            issues
        );
    }
}
