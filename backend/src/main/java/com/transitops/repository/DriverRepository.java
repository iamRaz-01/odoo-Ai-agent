package com.transitops.repository;

import com.transitops.entity.DriverEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface DriverRepository extends JpaRepository<DriverEntity, Long>, JpaSpecificationExecutor<DriverEntity> {
    Optional<DriverEntity> findByLicenseNumber(String licenseNumber);
    Optional<DriverEntity> findByEmail(String email);
    java.util.List<DriverEntity> findByStatusOrderByFullNameAsc(com.transitops.entity.DriverStatus status);
}
