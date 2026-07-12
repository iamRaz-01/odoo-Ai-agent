package com.transitops.validator;

import com.transitops.entity.DriverStatus;
import com.transitops.exception.InvalidDriverStatusException;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class DriverAvailabilityValidator {

    private static final Map<DriverStatus, Set<DriverStatus>> ALLOWED_TRANSITIONS = new EnumMap<>(DriverStatus.class);

    static {
        ALLOWED_TRANSITIONS.put(DriverStatus.AVAILABLE, EnumSet.of(
            DriverStatus.AVAILABLE,
            DriverStatus.ASSIGNED,
            DriverStatus.OFF_DUTY,
            DriverStatus.SUSPENDED,
            DriverStatus.INACTIVE
        ));
        ALLOWED_TRANSITIONS.put(DriverStatus.ASSIGNED, EnumSet.of(
            DriverStatus.ASSIGNED,
            DriverStatus.ON_TRIP,
            DriverStatus.AVAILABLE
        ));
        ALLOWED_TRANSITIONS.put(DriverStatus.ON_TRIP, EnumSet.of(
            DriverStatus.ON_TRIP,
            DriverStatus.AVAILABLE
        ));
        ALLOWED_TRANSITIONS.put(DriverStatus.OFF_DUTY, EnumSet.of(
            DriverStatus.OFF_DUTY,
            DriverStatus.AVAILABLE
        ));
        ALLOWED_TRANSITIONS.put(DriverStatus.SUSPENDED, EnumSet.of(
            DriverStatus.SUSPENDED,
            DriverStatus.AVAILABLE
        ));
        ALLOWED_TRANSITIONS.put(DriverStatus.INACTIVE, EnumSet.of(
            DriverStatus.INACTIVE,
            DriverStatus.AVAILABLE
        ));
    }

    public void validateTransition(DriverStatus current, DriverStatus target) {
        if (current == target) {
            return;
        }
        Set<DriverStatus> allowed = ALLOWED_TRANSITIONS.get(current);
        if (allowed == null || !allowed.contains(target)) {
            throw new InvalidDriverStatusException(
                String.format("Invalid driver status transition from %s to %s.", current, target)
            );
        }
    }
}
