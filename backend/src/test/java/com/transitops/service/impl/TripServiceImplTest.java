package com.transitops.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.transitops.dto.*;
import com.transitops.entity.*;
import com.transitops.exception.TripValidationException;
import com.transitops.mapper.TripMapper;
import com.transitops.repository.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
public class TripServiceImplTest {

    @Mock private TripRepository tripRepository;
    @Mock private VehicleRepository vehicleRepository;
    @Mock private DriverRepository driverRepository;
    @Mock private UserRepository userRepository;
    @Mock private TripMapper tripMapper;
    @Mock private SecurityContext securityContext;
    @Mock private Authentication authentication;

    @InjectMocks private TripServiceImpl tripService;

    private UserEntity managerUser;
    private DriverEntity availableDriver;
    private VehicleEntity availableVehicle;
    private VehicleTypeEntity truckType;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.setContext(securityContext);

        RoleEntity managerRole = new RoleEntity();
        managerRole.setName("FLEET_MANAGER");

        managerUser = new UserEntity();
        org.springframework.test.util.ReflectionTestUtils.setField(managerUser, "id", 1L);
        managerUser.setEmail("manager@transitops.com");
        managerUser.setFirstName("Fleet");
        managerUser.setLastName("Manager");
        managerUser.setRole(managerRole);

        availableDriver = new DriverEntity();
        availableDriver.setId(10L);
        availableDriver.setFullName("George Miller");
        availableDriver.setLicenseNumber("TX-9901");
        availableDriver.setLicenseExpiry(LocalDate.now().plusYears(2));
        availableDriver.setPhoneNumber("123-456-7890");
        availableDriver.setEmail("george@transitops.com");
        availableDriver.setSafetyScore(95);
        availableDriver.setStatus(DriverStatus.AVAILABLE);

        truckType = new VehicleTypeEntity();
        truckType.setId(1L);
        truckType.setName("Heavy Truck");

        availableVehicle = new VehicleEntity();
        availableVehicle.setId(20L);
        availableVehicle.setRegistrationNumber("REG-9910");
        availableVehicle.setCapacity(BigDecimal.valueOf(15.0)); // 15 tons
        availableVehicle.setVehicleType(truckType);
        availableVehicle.setStatus(VehicleStatus.AVAILABLE);
    }

    private void mockAuthentication(String email) {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
    }

    @Test
    void createTrip_DraftWithoutAssignments_Success() {
        mockAuthentication("manager@transitops.com");
        when(userRepository.findByEmailIgnoreCase("manager@transitops.com")).thenReturn(Optional.of(managerUser));

        TripRequest request = new TripRequest(
                "Route A Delivery",
                "Morning Delivery",
                "MEDIUM",
                "Chicago Warehouse",
                "Dallas Hub",
                "Dry Goods",
                BigDecimal.valueOf(5.0),
                LocalDate.now().plusDays(2),
                LocalTime.of(8, 0),
                null,
                null
        );

        when(tripRepository.save(any(TripEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(tripMapper.toResponse(any(TripEntity.class))).thenAnswer(invocation -> {
            TripEntity saved = invocation.getArgument(0);
            return new TripResponse(
                    1L,
                    saved.getTripNumber(),
                    saved.getTripName(),
                    saved.getDescription(),
                    saved.getPriority().name(),
                    saved.getSource(),
                    saved.getDestination(),
                    saved.getCargoType(),
                    saved.getCargoWeight(),
                    saved.getPlannedDate(),
                    saved.getPlannedTime(),
                    null,
                    null,
                    null,
                    null,
                    saved.getStatus().name(),
                    managerUser.getId(),
                    "Fleet Manager",
                    Instant.now(),
                    Instant.now()
            );
        });

        TripResponse response = tripService.create(request);

        assertNotNull(response);
        assertEquals("DRAFT", response.status());
        assertNotNull(response.tripNumber());
        assertTrue(response.tripNumber().startsWith("TRIP-"));
    }

    @Test
    void createTrip_AssignedDirectly_Success() {
        mockAuthentication("manager@transitops.com");
        when(userRepository.findByEmailIgnoreCase("manager@transitops.com")).thenReturn(Optional.of(managerUser));
        when(driverRepository.findById(10L)).thenReturn(Optional.of(availableDriver));
        when(vehicleRepository.findById(20L)).thenReturn(Optional.of(availableVehicle));
        when(tripRepository.existsByDriverIdAndStatusIn(eq(10L), any())).thenReturn(false);
        when(tripRepository.existsByVehicleIdAndStatusIn(eq(20L), any())).thenReturn(false);

        TripRequest request = new TripRequest(
                "Cargo Trip",
                "Standard Trip",
                "HIGH",
                "Chicago Warehouse",
                "Dallas Hub",
                "Heavy Steel",
                BigDecimal.valueOf(10.0),
                LocalDate.now().plusDays(1),
                LocalTime.of(10, 0),
                20L,
                10L
        );

        when(tripRepository.save(any(TripEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(tripMapper.toResponse(any(TripEntity.class))).thenAnswer(invocation -> {
            TripEntity saved = invocation.getArgument(0);
            return new TripResponse(
                    1L,
                    saved.getTripNumber(),
                    saved.getTripName(),
                    saved.getDescription(),
                    saved.getPriority().name(),
                    saved.getSource(),
                    saved.getDestination(),
                    saved.getCargoType(),
                    saved.getCargoWeight(),
                    saved.getPlannedDate(),
                    saved.getPlannedTime(),
                    20L,
                    "REG-9910",
                    10L,
                    "George Miller",
                    saved.getStatus().name(),
                    managerUser.getId(),
                    "Fleet Manager",
                    Instant.now(),
                    Instant.now()
            );
        });

        TripResponse response = tripService.create(request);

        assertNotNull(response);
        assertEquals("ASSIGNED", response.status());
        assertEquals(DriverStatus.ASSIGNED, availableDriver.getStatus());
        assertEquals(VehicleStatus.ASSIGNED, availableVehicle.getStatus());
    }

    @Test
    void createTrip_CargoWeightExceedsCapacity_ThrowsException() {
        mockAuthentication("manager@transitops.com");
        when(userRepository.findByEmailIgnoreCase("manager@transitops.com")).thenReturn(Optional.of(managerUser));
        when(vehicleRepository.findById(20L)).thenReturn(Optional.of(availableVehicle));

        TripRequest request = new TripRequest(
                "Cargo Trip Too Heavy",
                "Standard Trip",
                "HIGH",
                "Chicago Warehouse",
                "Dallas Hub",
                "Heavy Steel",
                BigDecimal.valueOf(25.0), // Exceeds 15.0 ton capacity
                LocalDate.now().plusDays(1),
                LocalTime.of(10, 0),
                20L,
                null
        );

        assertThrows(TripValidationException.class, () -> tripService.create(request));
    }

    @Test
    void createTrip_DriverUnavailable_ThrowsException() {
        mockAuthentication("manager@transitops.com");
        when(userRepository.findByEmailIgnoreCase("manager@transitops.com")).thenReturn(Optional.of(managerUser));
        
        availableDriver.setStatus(DriverStatus.ON_TRIP);
        when(driverRepository.findById(10L)).thenReturn(Optional.of(availableDriver));

        TripRequest request = new TripRequest(
                "Cargo Trip",
                "Standard Trip",
                "HIGH",
                "Chicago Warehouse",
                "Dallas Hub",
                "Steel",
                BigDecimal.valueOf(10.0),
                LocalDate.now().plusDays(1),
                LocalTime.of(10, 0),
                null,
                10L
        );

        assertThrows(TripValidationException.class, () -> tripService.create(request));
    }

    @Test
    void startTrip_Success_TransitionsDriverAndVehicleToOnTrip() {
        mockAuthentication("manager@transitops.com");
        when(userRepository.findByEmailIgnoreCase("manager@transitops.com")).thenReturn(Optional.of(managerUser));

        TripEntity trip = new TripEntity();
        trip.setId(100L);
        trip.setStatus(TripStatus.ASSIGNED);
        trip.setDriver(availableDriver);
        trip.setVehicle(availableVehicle);

        when(tripRepository.findById(100L)).thenReturn(Optional.of(trip));
        when(tripRepository.save(any(TripEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        tripService.start(100L);

        assertEquals(TripStatus.IN_PROGRESS, trip.getStatus());
        assertEquals(DriverStatus.ON_TRIP, availableDriver.getStatus());
        assertEquals(VehicleStatus.ON_TRIP, availableVehicle.getStatus());
    }

    @Test
    void completeTrip_Success_RestoresDriverAndVehicleToAvailable() {
        mockAuthentication("manager@transitops.com");
        when(userRepository.findByEmailIgnoreCase("manager@transitops.com")).thenReturn(Optional.of(managerUser));

        TripEntity trip = new TripEntity();
        trip.setId(100L);
        trip.setStatus(TripStatus.IN_PROGRESS);
        trip.setDriver(availableDriver);
        trip.setVehicle(availableVehicle);

        when(tripRepository.findById(100L)).thenReturn(Optional.of(trip));
        when(tripRepository.save(any(TripEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        tripService.complete(100L);

        assertEquals(TripStatus.COMPLETED, trip.getStatus());
        assertEquals(DriverStatus.AVAILABLE, availableDriver.getStatus());
        assertEquals(VehicleStatus.AVAILABLE, availableVehicle.getStatus());
    }

    @Test
    void cancelTrip_ReleasesAssignments() {
        TripEntity trip = new TripEntity();
        trip.setId(100L);
        trip.setStatus(TripStatus.ASSIGNED);
        trip.setDriver(availableDriver);
        trip.setVehicle(availableVehicle);

        when(tripRepository.findById(100L)).thenReturn(Optional.of(trip));
        when(tripRepository.save(any(TripEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        tripService.cancel(100L);

        assertEquals(TripStatus.CANCELLED, trip.getStatus());
        assertEquals(DriverStatus.AVAILABLE, availableDriver.getStatus());
        assertEquals(VehicleStatus.AVAILABLE, availableVehicle.getStatus());
    }
}
