package com.transitops.validator;

import com.transitops.entity.VehicleStatus;
import com.transitops.exception.InvalidVehicleStatusException;
import org.springframework.stereotype.Component;

@Component
public class VehicleStatusValidator {
    public void validateTransition(VehicleStatus currentStatus, VehicleStatus newStatus) {
        if (newStatus == null) {
            throw new InvalidVehicleStatusException("Vehicle status cannot be null.");
        }
        if (currentStatus == null) {
            return; // Initial creation
        }
        if (currentStatus == VehicleStatus.RETIRED && newStatus != VehicleStatus.RETIRED) {
            throw new InvalidVehicleStatusException("Retired vehicles cannot leave retired status.");
        }
    }
}
