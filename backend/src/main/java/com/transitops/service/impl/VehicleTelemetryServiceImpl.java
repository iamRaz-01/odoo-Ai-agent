package com.transitops.service.impl;

import com.transitops.dto.VehicleTelemetryResponse;
import com.transitops.entity.VehicleEntity;
import com.transitops.exception.VehicleNotFoundException;
import com.transitops.repository.VehicleRepository;
import com.transitops.service.VehicleTelemetryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@Transactional(readOnly = true)
public class VehicleTelemetryServiceImpl implements VehicleTelemetryService {

    private final VehicleRepository vehicleRepository;

    public VehicleTelemetryServiceImpl(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public VehicleTelemetryResponse getTelemetry(Long vehicleId) {
        VehicleEntity vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new VehicleNotFoundException(vehicleId));

        // Return actual database properties (mileage/odometer, fuel level)
        // and leave other fields as null placeholders (no fake data)
        return new VehicleTelemetryResponse(
            null, // engineTemperature
            null, // batteryVoltage
            vehicle.getFuelLevel() != null ? vehicle.getFuelLevel().doubleValue() : null, // fuelLevel
            null, // tirePressure
            null, // brakeStatus
            null, // oilHealth
            Collections.emptyList(), // engineFaultCodes
            vehicle.getOdometer() != null ? vehicle.getOdometer().doubleValue() : 0.0 // mileage
        );
    }
}
