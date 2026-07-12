package com.transitops.service;

import com.transitops.dto.VehicleReadinessResponse;

public interface FleetReadinessService {
    VehicleReadinessResponse checkReadiness(Long vehicleId);
}
