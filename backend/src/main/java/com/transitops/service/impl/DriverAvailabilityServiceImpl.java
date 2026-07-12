package com.transitops.service.impl;

import com.transitops.dto.DriverAvailabilityResponse;
import com.transitops.entity.DriverEntity;
import com.transitops.entity.DriverStatus;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.repository.DriverRepository;
import com.transitops.service.DriverAvailabilityService;
import java.time.LocalDate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DriverAvailabilityServiceImpl implements DriverAvailabilityService {

    private final DriverRepository driverRepository;

    public DriverAvailabilityServiceImpl(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public DriverAvailabilityResponse checkAvailability(Long driverId) {
        DriverEntity driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found with ID: " + driverId));

        LocalDate today = LocalDate.now();
        if (driver.getLicenseExpiry().isBefore(today) || driver.getLicenseExpiry().isEqual(today)) {
            return new DriverAvailabilityResponse(driverId, false, "Driver license has expired.");
        }

        if (driver.getStatus() == DriverStatus.SUSPENDED) {
            return new DriverAvailabilityResponse(driverId, false, "Driver is suspended.");
        }

        if (driver.getStatus() == DriverStatus.INACTIVE) {
            return new DriverAvailabilityResponse(driverId, false, "Driver is inactive.");
        }

        if (driver.getStatus() == DriverStatus.OFF_DUTY) {
            return new DriverAvailabilityResponse(driverId, false, "Driver is off duty.");
        }

        if (driver.getStatus() == DriverStatus.ASSIGNED || driver.getStatus() == DriverStatus.ON_TRIP) {
            return new DriverAvailabilityResponse(driverId, false, "Driver is currently assigned to another trip.");
        }

        if (driver.getStatus() != DriverStatus.AVAILABLE) {
            return new DriverAvailabilityResponse(driverId, false, "Driver is not available. Status: " + driver.getStatus());
        }

        return new DriverAvailabilityResponse(driverId, true, null);
    }
}
