package com.transitops.service.impl;

import com.transitops.dto.VehicleRequest;
import com.transitops.dto.VehicleResponse;
import com.transitops.dto.VehicleUpdateRequest;
import com.transitops.entity.VehicleEntity;
import com.transitops.entity.VehicleStatus;
import com.transitops.entity.VehicleTypeEntity;
import com.transitops.exception.DuplicateRegistrationException;
import com.transitops.exception.VehicleAlreadyRetiredException;
import com.transitops.exception.VehicleNotFoundException;
import com.transitops.mapper.VehicleMapper;
import com.transitops.repository.VehicleRepository;
import com.transitops.service.VehicleService;
import com.transitops.service.VehicleTypeService;
import com.transitops.validator.RegistrationNumberValidator;
import com.transitops.validator.VehicleCapacityValidator;
import com.transitops.validator.VehicleStatusValidator;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleTypeService vehicleTypeService;
    private final VehicleMapper vehicleMapper;
    private final RegistrationNumberValidator registrationNumberValidator;
    private final VehicleCapacityValidator vehicleCapacityValidator;
    private final VehicleStatusValidator vehicleStatusValidator;

    public VehicleServiceImpl(
            VehicleRepository vehicleRepository,
            VehicleTypeService vehicleTypeService,
            VehicleMapper vehicleMapper,
            RegistrationNumberValidator registrationNumberValidator,
            VehicleCapacityValidator vehicleCapacityValidator,
            VehicleStatusValidator vehicleStatusValidator) {
        this.vehicleRepository = vehicleRepository;
        this.vehicleTypeService = vehicleTypeService;
        this.vehicleMapper = vehicleMapper;
        this.registrationNumberValidator = registrationNumberValidator;
        this.vehicleCapacityValidator = vehicleCapacityValidator;
        this.vehicleStatusValidator = vehicleStatusValidator;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VehicleResponse> getVehicles(String search, VehicleStatus status, Long typeId, Pageable pageable) {
        Specification<VehicleEntity> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (search != null && !search.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("registrationNumber")), "%" + search.toLowerCase().trim() + "%"));
            }
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (typeId != null) {
                predicates.add(cb.equal(root.get("vehicleType").get("id"), typeId));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return vehicleRepository.findAll(spec, pageable).map(vehicleMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public VehicleResponse getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .map(vehicleMapper::toResponse)
                .orElseThrow(() -> new VehicleNotFoundException(id));
    }

    @Override
    public VehicleResponse createVehicle(VehicleRequest request) {
        registrationNumberValidator.validate(request.registrationNumber());
        String normReg = registrationNumberValidator.normalize(request.registrationNumber());

        if (vehicleRepository.existsByRegistrationNumberIgnoreCase(normReg)) {
            throw new DuplicateRegistrationException(normReg);
        }

        vehicleCapacityValidator.validate(request.capacity());
        vehicleStatusValidator.validateTransition(null, request.status());

        VehicleTypeEntity type = vehicleTypeService.getTypeEntityById(request.vehicleTypeId());

        VehicleEntity entity = vehicleMapper.toEntity(request);
        entity.setRegistrationNumber(normReg);
        entity.setVehicleType(type);

        VehicleEntity saved = vehicleRepository.save(entity);
        return vehicleMapper.toResponse(saved);
    }

    @Override
    public VehicleResponse updateVehicle(Long id, VehicleUpdateRequest request) {
        VehicleEntity entity = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException(id));

        // Business Rule: Retired vehicles cannot be modified except by Administrators.
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (entity.getStatus() == VehicleStatus.RETIRED && !isAdmin) {
            throw new VehicleAlreadyRetiredException(id);
        }

        vehicleCapacityValidator.validate(request.capacity());
        vehicleStatusValidator.validateTransition(entity.getStatus(), request.status());

        VehicleTypeEntity type = vehicleTypeService.getTypeEntityById(request.vehicleTypeId());

        vehicleMapper.updateEntityFromRequest(request, entity);
        entity.setVehicleType(type);

        VehicleEntity saved = vehicleRepository.save(entity);
        return vehicleMapper.toResponse(saved);
    }

    @Override
    public void deleteVehicle(Long id) {
        VehicleEntity entity = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException(id));
        
        // Check if admin/retired rule applies to delete as well
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (entity.getStatus() == VehicleStatus.RETIRED && !isAdmin) {
            throw new VehicleAlreadyRetiredException(id);
        }

        vehicleRepository.delete(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponse> searchByRegistrationNumber(String registrationNumber) {
        String query = registrationNumber != null ? registrationNumber.trim() : "";
        Specification<VehicleEntity> spec = (root, q, cb) -> cb.like(cb.lower(root.get("registrationNumber")), "%" + query.toLowerCase() + "%");
        return vehicleRepository.findAll(spec).stream()
                .map(vehicleMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponse> getVehiclesByStatus(VehicleStatus status) {
        return vehicleRepository.findByStatus(status).stream()
                .map(vehicleMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponse> getVehiclesByTypeId(Long typeId) {
        return vehicleRepository.findByVehicleTypeId(typeId).stream()
                .map(vehicleMapper::toResponse)
                .toList();
    }
}
