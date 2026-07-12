package com.transitops.repository;

import com.transitops.entity.TripEntity;
import com.transitops.entity.TripStatus;
import java.util.Collection;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TripRepository extends JpaRepository<TripEntity, Long>, JpaSpecificationExecutor<TripEntity> {
    Optional<TripEntity> findByTripNumber(String tripNumber);
    boolean existsByDriverIdAndStatusIn(Long driverId, Collection<TripStatus> statuses);
    boolean existsByVehicleIdAndStatusIn(Long vehicleId, Collection<TripStatus> statuses);
    boolean existsByDriverIdAndStatusInAndIdNot(Long driverId, Collection<TripStatus> statuses, Long excludeId);
    boolean existsByVehicleIdAndStatusInAndIdNot(Long vehicleId, Collection<TripStatus> statuses, Long excludeId);
}
