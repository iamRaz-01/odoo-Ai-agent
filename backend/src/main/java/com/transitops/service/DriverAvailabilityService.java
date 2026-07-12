package com.transitops.service;

import com.transitops.dto.DriverAvailabilityResponse;

public interface DriverAvailabilityService {
    DriverAvailabilityResponse checkAvailability(Long driverId);
}
