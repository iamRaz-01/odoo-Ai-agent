package com.transitops.repository;

import com.transitops.entity.VehicleEntity;
import com.transitops.entity.VehicleStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleRepository extends JpaRepository<VehicleEntity, Long>, JpaSpecificationExecutor<VehicleEntity> {
    Optional<VehicleEntity> findByRegistrationNumberIgnoreCase(String registrationNumber);
    boolean existsByRegistrationNumberIgnoreCase(String registrationNumber);
    List<VehicleEntity> findByStatus(VehicleStatus status);
    List<VehicleEntity> findByVehicleTypeId(Long typeId);
}
