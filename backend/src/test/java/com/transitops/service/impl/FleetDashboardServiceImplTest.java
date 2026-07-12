package com.transitops.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.transitops.dto.AlertResponse;
import com.transitops.dto.FleetDashboardResponse;
import com.transitops.dto.FleetHealthResponse;
import com.transitops.dto.FleetSummaryResponse;
import com.transitops.entity.VehicleDocumentEntity;
import com.transitops.entity.VehicleEntity;
import com.transitops.entity.VehicleStatus;
import com.transitops.repository.VehicleDocumentRepository;
import com.transitops.repository.VehicleRepository;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class FleetDashboardServiceImplTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private VehicleDocumentRepository vehicleDocumentRepository;

    @InjectMocks
    private FleetDashboardServiceImpl fleetDashboardService;

    private VehicleEntity vehicle1;
    private VehicleEntity vehicle2;
    private VehicleEntity vehicle3;
    private VehicleDocumentEntity doc1;

    @BeforeEach
    void setUp() {
        vehicle1 = new VehicleEntity();
        vehicle1.setId(1L);
        vehicle1.setStatus(VehicleStatus.ON_TRIP);
        vehicle1.setRegistrationNumber("REG-1");

        vehicle2 = new VehicleEntity();
        vehicle2.setId(2L);
        vehicle2.setStatus(VehicleStatus.AVAILABLE);
        vehicle2.setRegistrationNumber("REG-2");

        vehicle3 = new VehicleEntity();
        vehicle3.setId(3L);
        vehicle3.setStatus(VehicleStatus.BREAKDOWN);
        vehicle3.setRegistrationNumber("REG-3");

        doc1 = new VehicleDocumentEntity();
        doc1.setId(101L);
        doc1.setVehicle(vehicle1);
        doc1.setName("INSURANCE");
        doc1.setExpiryDate(LocalDate.now().minusDays(5)); // Expired
    }

    @Test
    void getSummary_Success() {
        when(vehicleRepository.findAll()).thenReturn(List.of(vehicle1, vehicle2, vehicle3));

        FleetSummaryResponse summary = fleetDashboardService.getSummary();

        assertNotNull(summary);
        assertEquals(3, summary.totalFleet());
        assertEquals(3, summary.activeVehicles());
        assertEquals(1, summary.onTrip());
        assertEquals(1, summary.availableVehicles());
        assertEquals(1, summary.breakdown());
    }

    @Test
    void getUtilization_Success() {
        when(vehicleRepository.findAll()).thenReturn(List.of(vehicle1, vehicle2, vehicle3));

        // Active vehicles = 3. On Trip = 1. Utilization = 1/3 * 100 = 33.33%
        double utilization = fleetDashboardService.getUtilization();

        assertEquals(33.33, utilization);
    }

    @Test
    void getHealth_Success() {
        when(vehicleRepository.findAll()).thenReturn(List.of(vehicle1, vehicle2, vehicle3));
        when(vehicleDocumentRepository.findAll()).thenReturn(List.of(doc1));

        // Breakdown count = 1. Expired doc = 1. Health Score = 100 - 1 - 1 = 98.
        FleetHealthResponse health = fleetDashboardService.getHealth();

        assertNotNull(health);
        assertEquals(98, health.score());
        assertEquals(1, health.breakdownCount());
        assertEquals(1, health.expiredDocumentsCount());
    }
}
