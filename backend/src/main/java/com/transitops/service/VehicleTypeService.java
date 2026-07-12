package com.transitops.service;

import com.transitops.dto.VehicleTypeResponse;
import com.transitops.entity.VehicleTypeEntity;
import java.util.List;

public interface VehicleTypeService {
    List<VehicleTypeResponse> getAllVehicleTypes();
    VehicleTypeEntity getTypeEntityById(Long id);
}
