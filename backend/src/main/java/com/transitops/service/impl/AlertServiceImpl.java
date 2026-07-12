package com.transitops.service.impl;

import com.transitops.dto.AlertResponse;
import com.transitops.entity.VehicleDocumentEntity;
import com.transitops.entity.VehicleEntity;
import com.transitops.entity.VehicleStatus;
import com.transitops.repository.VehicleDocumentRepository;
import com.transitops.repository.VehicleRepository;
import com.transitops.service.AlertService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class AlertServiceImpl implements AlertService {

    private final VehicleRepository vehicleRepository;
    private final VehicleDocumentRepository documentRepository;

    public AlertServiceImpl(VehicleRepository vehicleRepository, VehicleDocumentRepository documentRepository) {
        this.vehicleRepository = vehicleRepository;
        this.documentRepository = documentRepository;
    }

    @Override
    public List<AlertResponse> getActiveAlerts() {
        List<AlertResponse> alerts = new ArrayList<>();
        List<VehicleEntity> vehicles = vehicleRepository.findAll();
        LocalDate today = LocalDate.now();
        long alertId = 1;

        int activeCount = 0;
        int onTripCount = 0;

        for (VehicleEntity vehicle : vehicles) {
            // Count for fleet utilization below target check
            if (vehicle.getStatus() != VehicleStatus.RETIRED && vehicle.getStatus() != VehicleStatus.DECOMMISSIONED) {
                activeCount++;
                if (vehicle.getStatus() == VehicleStatus.ON_TRIP || vehicle.getStatus() == VehicleStatus.ASSIGNED) {
                    onTripCount++;
                }
            }

            // 1. Breakdown alert
            if (vehicle.getStatus() == VehicleStatus.BREAKDOWN) {
                alerts.add(new AlertResponse(
                    alertId++,
                    "BREAKDOWN",
                    "Vehicle is in breakdown status.",
                    vehicle.getId(),
                    vehicle.getRegistrationNumber(),
                    "Immediate repair attention required."
                ));
            }

            // 2. Low Fuel alert
            if (vehicle.getFuelLevel() != null && vehicle.getFuelLevel().compareTo(BigDecimal.valueOf(15.0)) < 0) {
                alerts.add(new AlertResponse(
                    alertId++,
                    "LOW_FUEL",
                    String.format("Low fuel: %s%%.", vehicle.getFuelLevel()),
                    vehicle.getId(),
                    vehicle.getRegistrationNumber(),
                    "Refuel required before dispatch."
                ));
            }

            // 3. Maintenance Due based on high mileage odometer
            if (vehicle.getOdometer() != null && vehicle.getOdometer().compareTo(BigDecimal.valueOf(15000.0)) > 0) {
                alerts.add(new AlertResponse(
                    alertId++,
                    "MAINTENANCE_DUE",
                    "Routine maintenance recommended (odometer exceeded 15,000 km).",
                    vehicle.getId(),
                    vehicle.getRegistrationNumber(),
                    String.format("Current Odometer: %s km", vehicle.getOdometer())
                ));
            }

            // 4. Idle / Not used recently checks
            if (vehicle.getUpdatedAt() != null) {
                long daysSinceUpdate = ChronoUnit.DAYS.between(vehicle.getUpdatedAt(), Instant.now());
                if (daysSinceUpdate >= 14) {
                    alerts.add(new AlertResponse(
                        alertId++,
                        "VEHICLE_NOT_USED_RECENTLY",
                        "Vehicle has not been active for over 14 days.",
                        vehicle.getId(),
                        vehicle.getRegistrationNumber(),
                        String.format("Inactive since: %s", vehicle.getUpdatedAt())
                    ));
                } else if (daysSinceUpdate >= 7) {
                    alerts.add(new AlertResponse(
                        alertId++,
                        "VEHICLE_IDLE",
                        "Vehicle has been idle for over 7 days.",
                        vehicle.getId(),
                        vehicle.getRegistrationNumber(),
                        String.format("Inactive since: %s", vehicle.getUpdatedAt())
                    ));
                }
            }

            // 5. Document Expiry alerts
            List<VehicleDocumentEntity> docs = documentRepository.findByVehicleId(vehicle.getId());
            for (VehicleDocumentEntity doc : docs) {
                long daysToExpiry = ChronoUnit.DAYS.between(today, doc.getExpiryDate());
                if (daysToExpiry < 0) {
                    alerts.add(new AlertResponse(
                        alertId++,
                        "DOCUMENT_EXPIRED",
                        String.format("Document %s is expired.", doc.getName()),
                        vehicle.getId(),
                        vehicle.getRegistrationNumber(),
                        String.format("Expired on %s (Overdue by %d days)", doc.getExpiryDate(), Math.abs(daysToExpiry))
                    ));
                } else if (daysToExpiry <= 30) {
                    alerts.add(new AlertResponse(
                        alertId++,
                        "DOCUMENT_EXPIRING",
                        String.format("Document %s is expiring in %d days.", doc.getName(), daysToExpiry),
                        vehicle.getId(),
                        vehicle.getRegistrationNumber(),
                        String.format("Expires on %s", doc.getExpiryDate())
                    ));
                }
            }
        }

        // 6. Fleet utilization below target
        if (activeCount > 0) {
            double utilization = ((double) onTripCount / activeCount) * 100.0;
            if (utilization < 50.0) {
                alerts.add(new AlertResponse(
                    alertId++,
                    "FLEET_UTILIZATION_LOW",
                    String.format("Fleet utilization is below target: %.1f%%.", utilization),
                    null,
                    "SYSTEM",
                    "Target utilization is >= 50.0%."
                ));
            }
        }

        return alerts;
    }
}
