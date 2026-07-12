package com.transitops.service.impl;

import com.transitops.dto.*;
import com.transitops.entity.*;
import com.transitops.exception.*;
import com.transitops.mapper.TripMapper;
import com.transitops.repository.*;
import com.transitops.service.TripService;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final UserRepository userRepository;
    private final TripMapper tripMapper;

    public TripServiceImpl(
            TripRepository tripRepository,
            VehicleRepository vehicleRepository,
            DriverRepository driverRepository,
            UserRepository userRepository,
            TripMapper tripMapper) {
        this.tripRepository = tripRepository;
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.userRepository = userRepository;
        this.tripMapper = tripMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TripResponse> findAll(TripSearchRequest searchRequest, Pageable pageable) {
        UserEntity currentUser = getCurrentUser();
        Long forcedDriverId = null;

        if (isDriver(currentUser)) {
            DriverEntity driver = getDriverForUser(currentUser);
            forcedDriverId = driver.getId();
        }

        Specification<TripEntity> spec = filterTrips(searchRequest, forcedDriverId);
        return tripRepository.findAll(spec, pageable).map(tripMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public TripResponse findById(Long id) {
        TripEntity trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + id));

        UserEntity currentUser = getCurrentUser();
        if (isDriver(currentUser)) {
            DriverEntity driver = getDriverForUser(currentUser);
            if (trip.getDriver() == null || !trip.getDriver().getId().equals(driver.getId())) {
                throw new AccessDeniedException("You are not authorized to view this trip.");
            }
        }

        return tripMapper.toResponse(trip);
    }

    @Override
    @Transactional
    public TripResponse create(TripRequest request) {
        UserEntity currentUser = getCurrentUser();

        TripEntity trip = new TripEntity();
        trip.setTripNumber("TRIP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        trip.setTripName(request.tripName());
        trip.setDescription(request.description());
        trip.setPriority(TripPriority.valueOf(request.priority().toUpperCase()));
        trip.setSource(request.source());
        trip.setDestination(request.destination());
        trip.setCargoType(request.cargoType());
        trip.setCargoWeight(request.cargoWeight());
        trip.setPlannedDate(request.plannedDate());
        trip.setPlannedTime(request.plannedTime());
        trip.setCreatedBy(currentUser);

        // Perform assignment if provided
        if (request.driverId() != null) {
            validateDriverForTrip(request.driverId(), null);
            DriverEntity driver = driverRepository.findById(request.driverId()).orElseThrow();
            trip.setDriver(driver);
        }

        if (request.vehicleId() != null) {
            validateVehicleForTrip(request.vehicleId(), request.cargoWeight(), null);
            VehicleEntity vehicle = vehicleRepository.findById(request.vehicleId()).orElseThrow();
            trip.setVehicle(vehicle);
        }

        if (trip.getDriver() != null && trip.getVehicle() != null) {
            trip.setStatus(TripStatus.ASSIGNED);
            trip.getDriver().setStatus(DriverStatus.ASSIGNED);
            trip.getVehicle().setStatus(VehicleStatus.ASSIGNED);
            driverRepository.save(trip.getDriver());
            vehicleRepository.save(trip.getVehicle());
        } else {
            trip.setStatus(TripStatus.DRAFT);
        }

        return tripMapper.toResponse(tripRepository.save(trip));
    }

    @Override
    @Transactional
    public TripResponse update(Long id, TripRequest request) {
        TripEntity trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + id));

        if (trip.getStatus() == TripStatus.COMPLETED || trip.getStatus() == TripStatus.CANCELLED) {
            throw new TripValidationException("Completed or cancelled trips cannot be modified.");
        }

        trip.setTripName(request.tripName());
        trip.setDescription(request.description());
        trip.setPriority(TripPriority.valueOf(request.priority().toUpperCase()));
        trip.setSource(request.source());
        trip.setDestination(request.destination());
        trip.setCargoType(request.cargoType());
        trip.setCargoWeight(request.cargoWeight());
        trip.setPlannedDate(request.plannedDate());
        trip.setPlannedTime(request.plannedTime());

        // Update Driver
        if (request.driverId() != null) {
            if (trip.getDriver() == null || !trip.getDriver().getId().equals(request.driverId())) {
                if (trip.getDriver() != null) {
                    trip.getDriver().setStatus(DriverStatus.AVAILABLE);
                    driverRepository.save(trip.getDriver());
                }
                validateDriverForTrip(request.driverId(), trip.getId());
                DriverEntity driver = driverRepository.findById(request.driverId()).orElseThrow();
                trip.setDriver(driver);
            }
        } else {
            if (trip.getDriver() != null) {
                trip.getDriver().setStatus(DriverStatus.AVAILABLE);
                driverRepository.save(trip.getDriver());
                trip.setDriver(null);
            }
        }

        // Update Vehicle
        if (request.vehicleId() != null) {
            if (trip.getVehicle() == null || !trip.getVehicle().getId().equals(request.vehicleId())) {
                if (trip.getVehicle() != null) {
                    trip.getVehicle().setStatus(VehicleStatus.AVAILABLE);
                    vehicleRepository.save(trip.getVehicle());
                }
                validateVehicleForTrip(request.vehicleId(), request.cargoWeight(), trip.getId());
                VehicleEntity vehicle = vehicleRepository.findById(request.vehicleId()).orElseThrow();
                trip.setVehicle(vehicle);
            }
        } else {
            if (trip.getVehicle() != null) {
                trip.getVehicle().setStatus(VehicleStatus.AVAILABLE);
                vehicleRepository.save(trip.getVehicle());
                trip.setVehicle(null);
            }
        }

        // Propagate status
        if (trip.getDriver() != null && trip.getVehicle() != null) {
            trip.setStatus(TripStatus.ASSIGNED);
            trip.getDriver().setStatus(DriverStatus.ASSIGNED);
            trip.getVehicle().setStatus(VehicleStatus.ASSIGNED);
            driverRepository.save(trip.getDriver());
            vehicleRepository.save(trip.getVehicle());
        } else {
            trip.setStatus(TripStatus.DRAFT);
        }

        return tripMapper.toResponse(tripRepository.save(trip));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        TripEntity trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + id));

        releaseDriverAndVehicle(trip);
        tripRepository.delete(trip);
    }

    @Override
    @Transactional
    public TripResponse assign(Long id, TripAssignRequest request) {
        TripEntity trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + id));

        if (trip.getStatus() == TripStatus.COMPLETED || trip.getStatus() == TripStatus.CANCELLED) {
            throw new TripValidationException("Completed or cancelled trips cannot be modified.");
        }

        // Assign Driver
        if (request.driverId() != null) {
            if (trip.getDriver() == null || !trip.getDriver().getId().equals(request.driverId())) {
                if (trip.getDriver() != null) {
                    trip.getDriver().setStatus(DriverStatus.AVAILABLE);
                    driverRepository.save(trip.getDriver());
                }
                validateDriverForTrip(request.driverId(), trip.getId());
                DriverEntity driver = driverRepository.findById(request.driverId()).orElseThrow();
                trip.setDriver(driver);
            }
        } else {
            if (trip.getDriver() != null) {
                trip.getDriver().setStatus(DriverStatus.AVAILABLE);
                driverRepository.save(trip.getDriver());
                trip.setDriver(null);
            }
        }

        // Assign Vehicle
        if (request.vehicleId() != null) {
            if (trip.getVehicle() == null || !trip.getVehicle().getId().equals(request.vehicleId())) {
                if (trip.getVehicle() != null) {
                    trip.getVehicle().setStatus(VehicleStatus.AVAILABLE);
                    vehicleRepository.save(trip.getVehicle());
                }
                validateVehicleForTrip(request.vehicleId(), trip.getCargoWeight(), trip.getId());
                VehicleEntity vehicle = vehicleRepository.findById(request.vehicleId()).orElseThrow();
                trip.setVehicle(vehicle);
            }
        } else {
            if (trip.getVehicle() != null) {
                trip.getVehicle().setStatus(VehicleStatus.AVAILABLE);
                vehicleRepository.save(trip.getVehicle());
                trip.setVehicle(null);
            }
        }

        if (trip.getDriver() != null && trip.getVehicle() != null) {
            trip.setStatus(TripStatus.ASSIGNED);
            trip.getDriver().setStatus(DriverStatus.ASSIGNED);
            trip.getVehicle().setStatus(VehicleStatus.ASSIGNED);
            driverRepository.save(trip.getDriver());
            vehicleRepository.save(trip.getVehicle());
        } else {
            trip.setStatus(TripStatus.DRAFT);
        }

        return tripMapper.toResponse(tripRepository.save(trip));
    }

    @Override
    @Transactional
    public TripResponse start(Long id) {
        TripEntity trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + id));

        UserEntity currentUser = getCurrentUser();
        if (isDriver(currentUser)) {
            DriverEntity driver = getDriverForUser(currentUser);
            if (trip.getDriver() == null || !trip.getDriver().getId().equals(driver.getId())) {
                throw new AccessDeniedException("You are not authorized to start this trip.");
            }
        }

        if (trip.getStatus() == TripStatus.CANCELLED) {
            throw new TripValidationException("Cancelled trips cannot be started.");
        }
        if (trip.getStatus() != TripStatus.ASSIGNED) {
            throw new TripValidationException("Only trips in ASSIGNED status can be started.");
        }

        trip.setStatus(TripStatus.IN_PROGRESS);
        if (trip.getDriver() != null) {
            trip.getDriver().setStatus(DriverStatus.ON_TRIP);
            driverRepository.save(trip.getDriver());
        }
        if (trip.getVehicle() != null) {
            trip.getVehicle().setStatus(VehicleStatus.ON_TRIP);
            vehicleRepository.save(trip.getVehicle());
        }

        return tripMapper.toResponse(tripRepository.save(trip));
    }

    @Override
    @Transactional
    public TripResponse complete(Long id) {
        TripEntity trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + id));

        UserEntity currentUser = getCurrentUser();
        if (isDriver(currentUser)) {
            DriverEntity driver = getDriverForUser(currentUser);
            if (trip.getDriver() == null || !trip.getDriver().getId().equals(driver.getId())) {
                throw new AccessDeniedException("You are not authorized to complete this trip.");
            }
        }

        if (trip.getStatus() != TripStatus.IN_PROGRESS) {
            throw new TripValidationException("Only trips in IN_PROGRESS status can be completed.");
        }

        trip.setStatus(TripStatus.COMPLETED);
        if (trip.getDriver() != null) {
            trip.getDriver().setStatus(DriverStatus.AVAILABLE);
            driverRepository.save(trip.getDriver());
        }
        if (trip.getVehicle() != null) {
            trip.getVehicle().setStatus(VehicleStatus.AVAILABLE);
            vehicleRepository.save(trip.getVehicle());
        }

        return tripMapper.toResponse(tripRepository.save(trip));
    }

    @Override
    @Transactional
    public TripResponse cancel(Long id) {
        TripEntity trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + id));

        if (trip.getStatus() == TripStatus.COMPLETED) {
            throw new TripValidationException("Completed trips cannot be cancelled.");
        }

        trip.setStatus(TripStatus.CANCELLED);
        releaseDriverAndVehicle(trip);

        return tripMapper.toResponse(tripRepository.save(trip));
    }

    private UserEntity getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UnauthorizedException("User not authenticated."));
    }

    private boolean isDriver(UserEntity user) {
        return "DRIVER".equals(user.getRole().getName());
    }

    private DriverEntity getDriverForUser(UserEntity user) {
        return driverRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found."));
    }

    private void releaseDriverAndVehicle(TripEntity trip) {
        if (trip.getDriver() != null) {
            trip.getDriver().setStatus(DriverStatus.AVAILABLE);
            driverRepository.save(trip.getDriver());
        }
        if (trip.getVehicle() != null) {
            trip.getVehicle().setStatus(VehicleStatus.AVAILABLE);
            vehicleRepository.save(trip.getVehicle());
        }
    }

    private void validateDriverForTrip(Long driverId, Long currentTripId) {
        DriverEntity driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found."));

        if (driver.getStatus() != DriverStatus.AVAILABLE) {
            throw new TripValidationException("Driver is not available. Current status: " + driver.getStatus());
        }

        if (driver.getLicenseExpiry().isBefore(LocalDate.now())) {
            throw new TripValidationException("Driver license has expired.");
        }

        boolean alreadyAssigned = currentTripId == null
                ? tripRepository.existsByDriverIdAndStatusIn(driverId, List.of(TripStatus.ASSIGNED, TripStatus.IN_PROGRESS))
                : tripRepository.existsByDriverIdAndStatusInAndIdNot(driverId, List.of(TripStatus.ASSIGNED, TripStatus.IN_PROGRESS), currentTripId);

        if (alreadyAssigned) {
            throw new TripValidationException("Driver is already assigned to another active trip.");
        }
    }

    private void validateVehicleForTrip(Long vehicleId, BigDecimal cargoWeight, Long currentTripId) {
        VehicleEntity vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found."));

        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
            throw new TripValidationException("Vehicle is not available. Current status: " + vehicle.getStatus());
        }

        if (vehicle.getStatus() == VehicleStatus.IN_SHOP || vehicle.getStatus() == VehicleStatus.MAINTENANCE) {
            throw new TripValidationException("Vehicle is under maintenance.");
        }

        boolean alreadyAssigned = currentTripId == null
                ? tripRepository.existsByVehicleIdAndStatusIn(vehicleId, List.of(TripStatus.ASSIGNED, TripStatus.IN_PROGRESS))
                : tripRepository.existsByVehicleIdAndStatusInAndIdNot(vehicleId, List.of(TripStatus.ASSIGNED, TripStatus.IN_PROGRESS), currentTripId);

        if (alreadyAssigned) {
            throw new TripValidationException("Vehicle is already assigned to another active trip.");
        }

        if (vehicle.getCapacity() != null && vehicle.getCapacity().compareTo(cargoWeight) < 0) {
            throw new TripValidationException("Cargo weight exceeds vehicle capacity.");
        }
    }

    private Specification<TripEntity> filterTrips(TripSearchRequest request, Long forcedDriverId) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (forcedDriverId != null) {
                predicates.add(cb.equal(root.get("driver").get("id"), forcedDriverId));
            }

            if (request != null) {
                if (request.status() != null && !request.status().isBlank()) {
                    predicates.add(cb.equal(root.get("status"), TripStatus.valueOf(request.status().toUpperCase())));
                }
                if (request.priority() != null && !request.priority().isBlank()) {
                    predicates.add(cb.equal(root.get("priority"), TripPriority.valueOf(request.priority().toUpperCase())));
                }
                if (request.plannedDate() != null) {
                    predicates.add(cb.equal(root.get("plannedDate"), request.plannedDate()));
                }
                if (request.searchTerm() != null && !request.searchTerm().isBlank()) {
                    String pattern = "%" + request.searchTerm().toLowerCase() + "%";
                    Predicate nameLike = cb.like(cb.lower(root.get("tripName")), pattern);
                    Predicate numberLike = cb.like(cb.lower(root.get("tripNumber")), pattern);
                    Predicate cargoLike = cb.like(cb.lower(root.get("cargoType")), pattern);
                    Predicate sourceLike = cb.like(cb.lower(root.get("source")), pattern);
                    Predicate destLike = cb.like(cb.lower(root.get("destination")), pattern);
                    predicates.add(cb.or(nameLike, numberLike, cargoLike, sourceLike, destLike));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
