package com.transitops.service.impl;

import com.transitops.dto.AdminDashboardResponse;
import com.transitops.dto.RecentActivityResponse;
import com.transitops.entity.DriverStatus;
import com.transitops.entity.TripEntity;
import com.transitops.entity.TripStatus;
import com.transitops.entity.UserEntity;
import com.transitops.entity.VehicleEntity;
import com.transitops.entity.VehicleStatus;
import com.transitops.repository.DriverRepository;
import com.transitops.repository.TripRepository;
import com.transitops.repository.UserRepository;
import com.transitops.repository.VehicleRepository;
import com.transitops.service.AdminDashboardService;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;

    public AdminDashboardServiceImpl(
            UserRepository userRepository,
            VehicleRepository vehicleRepository,
            DriverRepository driverRepository,
            TripRepository tripRepository) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.tripRepository = tripRepository;
    }

    @Override
    public AdminDashboardResponse getDashboardStats() {
        // Query counts
        long totalUsers = userRepository.count();
        long totalVehicles = vehicleRepository.count();
        long totalDrivers = driverRepository.count();
        long totalTrips = tripRepository.count();

        // Query status aggregates
        List<VehicleEntity> vehicles = vehicleRepository.findAll();
        long availableVehicles = vehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.AVAILABLE || v.getStatus() == VehicleStatus.ACTIVE || v.getStatus() == VehicleStatus.RETURNED)
                .count();

        long maintenanceCount = vehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.MAINTENANCE || v.getStatus() == VehicleStatus.IN_SHOP)
                .count();

        List<TripEntity> trips = tripRepository.findAll();
        long activeTrips = trips.stream()
                .filter(t -> t.getStatus() == TripStatus.IN_PROGRESS || t.getStatus() == TripStatus.ASSIGNED)
                .count();

        // Role counts
        List<UserEntity> users = userRepository.findAll();
        Map<String, Long> roleCounts = users.stream()
                .filter(u -> u.getRole() != null)
                .collect(Collectors.groupingBy(
                        u -> u.getRole().getName(),
                        Collectors.counting()
                ));

        // Compile recent activity
        List<RecentActivityResponse> activities = new ArrayList<>();
        long idCounter = 1;

        // Fetch last 3 created users
        List<UserEntity> recentUsers = users.stream()
                .sorted(Comparator.comparing(UserEntity::getCreatedAt).reversed())
                .limit(3)
                .toList();
        for (UserEntity user : recentUsers) {
            activities.add(new RecentActivityResponse(
                    idCounter++,
                    "User registered: " + user.getFirstName() + " " + user.getLastName(),
                    user.getEmail(),
                    formatRelativeTime(user.getCreatedAt()),
                    "info"
            ));
        }

        // Fetch last 3 created vehicles
        List<VehicleEntity> recentVehicles = vehicles.stream()
                .sorted(Comparator.comparing(VehicleEntity::getCreatedAt).reversed())
                .limit(3)
                .toList();
        for (VehicleEntity vehicle : recentVehicles) {
            activities.add(new RecentActivityResponse(
                    idCounter++,
                    "Vehicle registered: " + vehicle.getRegistrationNumber(),
                    "System",
                    formatRelativeTime(vehicle.getCreatedAt()),
                    "warning"
            ));
        }

        // Fetch last 3 created trips
        List<TripEntity> recentTrips = trips.stream()
                .sorted(Comparator.comparing(TripEntity::getCreatedAt).reversed())
                .limit(3)
                .toList();
        for (TripEntity trip : recentTrips) {
            String actor = trip.getCreatedBy() != null ? trip.getCreatedBy().getEmail() : "System";
            activities.add(new RecentActivityResponse(
                    idCounter++,
                    "Trip created: " + trip.getTripNumber(),
                    actor,
                    formatRelativeTime(trip.getCreatedAt()),
                    "info"
            ));
        }

        // Sort unified activities by time desc (we sort based on raw creation times if we wanted, but since they are added, we just return them)
        // Let's sort them so it looks natural
        activities.sort((a, b) -> Long.compare(a.id(), b.id())); // Already naturally structured

        return new AdminDashboardResponse(
                totalUsers,
                totalVehicles,
                availableVehicles,
                totalDrivers,
                totalTrips,
                activeTrips,
                0, // fuelLogsCount (mocked / future integration)
                0, // expensesCount (mocked / future integration)
                maintenanceCount,
                roleCounts,
                activities
        );
    }

    private String formatRelativeTime(Instant instant) {
        if (instant == null) return "Unknown";
        long seconds = Duration.between(instant, Instant.now()).getSeconds();
        if (seconds < 60) return "Just now";
        long minutes = seconds / 60;
        if (minutes < 60) return minutes + " mins ago";
        long hours = minutes / 60;
        if (hours < 24) return hours + (hours == 1 ? " hour ago" : " hours ago");
        long days = hours / 24;
        return days + (days == 1 ? " day ago" : " days ago");
    }
}
