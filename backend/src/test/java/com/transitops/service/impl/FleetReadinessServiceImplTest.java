package com.transitops.service.impl;

import com.transitops.dto.FleetAnalyticsResponse;
import com.transitops.dto.VehicleReadinessResponse;
import com.transitops.entity.VehicleDocumentEntity;
import com.transitops.entity.VehicleEntity;
import com.transitops.entity.VehicleStatus;
import com.transitops.exception.InvalidVehicleStatusException;
import com.transitops.repository.VehicleDocumentRepository;
import com.transitops.repository.VehicleRepository;
import com.transitops.validator.VehicleStatusValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class FleetReadinessServiceImplTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private VehicleDocumentRepository documentRepository;

    private FleetReadinessServiceImpl readinessService;
    private FleetAnalyticsServiceImpl analyticsService;
    private VehicleStatusValidator statusValidator;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        readinessService = new FleetReadinessServiceImpl(vehicleRepository, documentRepository);
        analyticsService = new FleetAnalyticsServiceImpl(vehicleRepository);
        statusValidator = new VehicleStatusValidator();
    }

    @Test
    void testCheckReadiness_Success() {
        VehicleEntity vehicle = new VehicleEntity();
        vehicle.setId(1L);
        vehicle.setRegistrationNumber("NY-1111");
        vehicle.setStatus(VehicleStatus.ACTIVE);
        vehicle.setDriverId(10L);
        vehicle.setFuelLevel(BigDecimal.valueOf(85.0));

        VehicleDocumentEntity ins = new VehicleDocumentEntity();
        ins.setName("INSURANCE");
        ins.setExpiryDate(LocalDate.now().plusDays(10));

        VehicleDocumentEntity fit = new VehicleDocumentEntity();
        fit.setName("FITNESS");
        fit.setExpiryDate(LocalDate.now().plusDays(15));

        VehicleDocumentEntity pol = new VehicleDocumentEntity();
        pol.setName("POLLUTION");
        pol.setExpiryDate(LocalDate.now().plusDays(5));

        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));
        when(documentRepository.findByVehicleId(1L)).thenReturn(List.of(ins, fit, pol));

        VehicleReadinessResponse response = readinessService.checkReadiness(1L);

        assertTrue(response.ready());
        assertTrue(response.insuranceValid());
        assertTrue(response.fitnessValid());
        assertTrue(response.pollutionValid());
        assertTrue(response.fuelAvailable());
        assertTrue(response.driverAssigned());
        assertTrue(response.issues().isEmpty());
    }

    @Test
    void testCheckReadiness_ExpiredDocumentsAndNoDriver() {
        VehicleEntity vehicle = new VehicleEntity();
        vehicle.setId(2L);
        vehicle.setRegistrationNumber("NY-2222");
        vehicle.setStatus(VehicleStatus.ACTIVE);
        vehicle.setFuelLevel(BigDecimal.valueOf(10.0)); // low fuel

        VehicleDocumentEntity ins = new VehicleDocumentEntity();
        ins.setName("INSURANCE");
        ins.setExpiryDate(LocalDate.now().minusDays(2)); // expired

        when(vehicleRepository.findById(2L)).thenReturn(Optional.of(vehicle));
        when(documentRepository.findByVehicleId(2L)).thenReturn(List.of(ins));

        VehicleReadinessResponse response = readinessService.checkReadiness(2L);

        assertFalse(response.ready());
        assertFalse(response.insuranceValid());
        assertFalse(response.fuelAvailable());
        assertFalse(response.driverAssigned());
        assertEquals(5, response.issues().size()); // insurance, fitness, pollution, fuel, driver
    }

    @Test
    void testVehicleLifecycleTransition_Valid() {
        assertDoesNotThrow(() -> statusValidator.validateTransition(VehicleStatus.PURCHASED, VehicleStatus.REGISTERED));
        assertDoesNotThrow(() -> statusValidator.validateTransition(VehicleStatus.REGISTERED, VehicleStatus.ACTIVE));
        assertDoesNotThrow(() -> statusValidator.validateTransition(VehicleStatus.ACTIVE, VehicleStatus.ASSIGNED));
    }

    @Test
    void testVehicleLifecycleTransition_Invalid() {
        assertThrows(InvalidVehicleStatusException.class, () ->
            statusValidator.validateTransition(VehicleStatus.PURCHASED, VehicleStatus.ACTIVE)
        );
        assertThrows(InvalidVehicleStatusException.class, () ->
            statusValidator.validateTransition(VehicleStatus.RETIRED, VehicleStatus.ACTIVE)
        );
    }

    @Test
    void testAnalyticsAggregation() {
        VehicleEntity v1 = new VehicleEntity();
        v1.setStatus(VehicleStatus.ON_TRIP);
        v1.setOdometer(BigDecimal.valueOf(1000.0));

        VehicleEntity v2 = new VehicleEntity();
        v2.setStatus(VehicleStatus.ACTIVE);
        v2.setOdometer(BigDecimal.valueOf(2500.0));

        when(vehicleRepository.findAll()).thenReturn(List.of(v1, v2));

        FleetAnalyticsResponse response = analyticsService.getAnalytics();

        assertEquals(50.0, response.utilizationRate()); // 1 on trip out of 2 active
        assertEquals(3500.0, response.totalDistanceCovered());
    }
}
