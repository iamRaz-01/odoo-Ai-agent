package com.transitops.repository;

import com.transitops.entity.VehicleDocumentEntity;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleDocumentRepository extends JpaRepository<VehicleDocumentEntity, Long> {
    List<VehicleDocumentEntity> findByVehicleId(Long vehicleId);
    List<VehicleDocumentEntity> findByExpiryDateBefore(LocalDate date);
}
