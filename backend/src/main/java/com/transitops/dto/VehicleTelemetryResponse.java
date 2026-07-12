package com.transitops.dto;

import java.util.List;

public record VehicleTelemetryResponse(
    Double engineTemperature,
    Double batteryVoltage,
    Double fuelLevel,
    Double tirePressure,
    String brakeStatus,
    String oilHealth,
    List<String> engineFaultCodes,
    Double mileage
) {}
