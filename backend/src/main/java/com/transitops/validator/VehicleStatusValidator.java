package com.transitops.validator;

import com.transitops.entity.VehicleStatus;
import com.transitops.exception.InvalidVehicleStatusException;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class VehicleStatusValidator {

    private static final Map<VehicleStatus, List<VehicleStatus>> ALLOWED_TRANSITIONS = Map.ofEntries(
        // Extended Lifecycle States
        Map.entry(VehicleStatus.PURCHASED, List.of(VehicleStatus.REGISTERED, VehicleStatus.DECOMMISSIONED, VehicleStatus.RETIRED)),
        Map.entry(VehicleStatus.REGISTERED, List.of(VehicleStatus.ACTIVE, VehicleStatus.DECOMMISSIONED, VehicleStatus.RETIRED)),
        Map.entry(VehicleStatus.ACTIVE, List.of(VehicleStatus.ASSIGNED, VehicleStatus.MAINTENANCE, VehicleStatus.DECOMMISSIONED, VehicleStatus.RETIRED)),
        Map.entry(VehicleStatus.ASSIGNED, List.of(VehicleStatus.RETURNED, VehicleStatus.MAINTENANCE, VehicleStatus.ACTIVE)),
        Map.entry(VehicleStatus.MAINTENANCE, List.of(VehicleStatus.RETURNED, VehicleStatus.ACTIVE)),
        Map.entry(VehicleStatus.RETURNED, List.of(VehicleStatus.ACTIVE, VehicleStatus.ASSIGNED, VehicleStatus.MAINTENANCE)),
        Map.entry(VehicleStatus.DECOMMISSIONED, List.of(VehicleStatus.RETIRED)),

        // Legacy / Backward Compatible Statuses
        Map.entry(VehicleStatus.AVAILABLE, List.of(VehicleStatus.RESERVED, VehicleStatus.ON_TRIP, VehicleStatus.IN_SHOP, VehicleStatus.BREAKDOWN, VehicleStatus.RETIRED)),
        Map.entry(VehicleStatus.RESERVED, List.of(VehicleStatus.ON_TRIP, VehicleStatus.AVAILABLE)),
        Map.entry(VehicleStatus.ON_TRIP, List.of(VehicleStatus.AVAILABLE, VehicleStatus.BREAKDOWN)),
        Map.entry(VehicleStatus.IN_SHOP, List.of(VehicleStatus.AVAILABLE)),
        Map.entry(VehicleStatus.BREAKDOWN, List.of(VehicleStatus.IN_SHOP)),
        
        // Final State
        Map.entry(VehicleStatus.RETIRED, List.of())
    );

    public void validateTransition(VehicleStatus currentStatus, VehicleStatus newStatus) {
        if (newStatus == null) {
            throw new InvalidVehicleStatusException("Vehicle status cannot be null.");
        }
        if (currentStatus == null) {
            return; // Initial creation allowed
        }
        if (currentStatus == newStatus) {
            return; // No-op transition is always allowed
        }

        List<VehicleStatus> allowed = ALLOWED_TRANSITIONS.get(currentStatus);
        if (allowed == null || !allowed.contains(newStatus)) {
            throw new InvalidVehicleStatusException(
                String.format("Invalid status transition from %s to %s.", currentStatus, newStatus)
            );
        }
    }
}
