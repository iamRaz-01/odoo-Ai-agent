package com.transitops.service;

import com.transitops.dto.VehicleRequest;
import com.transitops.dto.VehicleResponse;
import com.transitops.dto.VehicleUpdateRequest;
import com.transitops.entity.VehicleStatus;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VehicleService {
    Page<VehicleResponse> getVehicles(String search, VehicleStatus status, Long typeId, Pageable pageable);
    VehicleResponse getVehicleById(Long id);
    VehicleResponse createVehicle(VehicleRequest request);
    VehicleResponse updateVehicle(Long id, VehicleUpdateRequest request);
    void deleteVehicle(Long id);
    List<VehicleResponse> searchByRegistrationNumber(String registrationNumber);
    List<VehicleResponse> getVehiclesByStatus(VehicleStatus status);
    List<VehicleResponse> getVehiclesByTypeId(Long typeId);
    VehicleResponse scheduleMaintenance(Long id);
    VehicleResponse closeMaintenance(Long id);
}
