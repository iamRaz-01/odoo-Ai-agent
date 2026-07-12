package com.transitops.service.impl;

import com.transitops.dto.VehicleTypeResponse;
import com.transitops.entity.VehicleTypeEntity;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.mapper.VehicleTypeMapper;
import com.transitops.repository.VehicleTypeRepository;
import com.transitops.service.VehicleTypeService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class VehicleTypeServiceImpl implements VehicleTypeService {

    private final VehicleTypeRepository vehicleTypeRepository;
    private final VehicleTypeMapper vehicleTypeMapper;

    public VehicleTypeServiceImpl(VehicleTypeRepository vehicleTypeRepository, VehicleTypeMapper vehicleTypeMapper) {
        this.vehicleTypeRepository = vehicleTypeRepository;
        this.vehicleTypeMapper = vehicleTypeMapper;
    }

    @Override
    public List<VehicleTypeResponse> getAllVehicleTypes() {
        return vehicleTypeRepository.findAll().stream()
                .map(vehicleTypeMapper::toResponse)
                .toList();
    }

    @Override
    public VehicleTypeEntity getTypeEntityById(Long id) {
        return vehicleTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle Type not found with ID: " + id));
    }
}
