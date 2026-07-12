package com.transitops.service.impl;

import com.transitops.dto.VehicleDocumentRequest;
import com.transitops.dto.VehicleDocumentResponse;
import com.transitops.entity.VehicleDocumentEntity;
import com.transitops.entity.VehicleEntity;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.mapper.VehicleDocumentMapper;
import com.transitops.repository.VehicleDocumentRepository;
import com.transitops.repository.VehicleRepository;
import com.transitops.service.VehicleDocumentService;
import com.transitops.validator.VehicleDocumentValidator;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class VehicleDocumentServiceImpl implements VehicleDocumentService {

    private final VehicleDocumentRepository vehicleDocumentRepository;
    private final VehicleRepository vehicleRepository;
    private final VehicleDocumentMapper vehicleDocumentMapper;
    private final VehicleDocumentValidator vehicleDocumentValidator;

    public VehicleDocumentServiceImpl(
            VehicleDocumentRepository vehicleDocumentRepository,
            VehicleRepository vehicleRepository,
            VehicleDocumentMapper vehicleDocumentMapper,
            VehicleDocumentValidator vehicleDocumentValidator) {
        this.vehicleDocumentRepository = vehicleDocumentRepository;
        this.vehicleRepository = vehicleRepository;
        this.vehicleDocumentMapper = vehicleDocumentMapper;
        this.vehicleDocumentValidator = vehicleDocumentValidator;
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleDocumentResponse> getDocumentsByVehicleId(Long vehicleId) {
        if (!vehicleRepository.existsById(vehicleId)) {
            throw new ResourceNotFoundException("Vehicle not found with ID: " + vehicleId);
        }
        return vehicleDocumentRepository.findByVehicleId(vehicleId).stream()
                .map(vehicleDocumentMapper::toResponse)
                .toList();
    }

    @Override
    public VehicleDocumentResponse uploadDocument(Long vehicleId, VehicleDocumentRequest request) {
        vehicleDocumentValidator.validate(request);
        VehicleEntity vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + vehicleId));

        VehicleDocumentEntity entity = vehicleDocumentMapper.toEntity(request);
        entity.setVehicle(vehicle);

        VehicleDocumentEntity saved = vehicleDocumentRepository.save(entity);
        return vehicleDocumentMapper.toResponse(saved);
    }

    @Override
    public VehicleDocumentResponse updateDocument(Long documentId, VehicleDocumentRequest request) {
        vehicleDocumentValidator.validate(request);
        VehicleDocumentEntity entity = vehicleDocumentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle Document not found with ID: " + documentId));

        vehicleDocumentMapper.updateEntityFromRequest(request, entity);
        VehicleDocumentEntity saved = vehicleDocumentRepository.save(entity);
        return vehicleDocumentMapper.toResponse(saved);
    }

    @Override
    public void deleteDocument(Long documentId) {
        VehicleDocumentEntity entity = vehicleDocumentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle Document not found with ID: " + documentId));
        vehicleDocumentRepository.delete(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleDocumentResponse> getExpiredDocuments() {
        return vehicleDocumentRepository.findByExpiryDateBefore(LocalDate.now()).stream()
                .map(vehicleDocumentMapper::toResponse)
                .toList();
    }
}
