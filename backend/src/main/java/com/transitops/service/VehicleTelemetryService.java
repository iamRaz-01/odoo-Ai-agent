package com.transitops.service;

import com.transitops.dto.VehicleTelemetryResponse;

public interface VehicleTelemetryService {
    VehicleTelemetryResponse getTelemetry(Long vehicleId);
}
