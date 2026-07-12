package com.transitops.repository;

import com.transitops.entity.VehicleTypeEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleTypeRepository extends JpaRepository<VehicleTypeEntity, Long> {
    Optional<VehicleTypeEntity> findByName(String name);
    boolean existsByName(String name);
}
