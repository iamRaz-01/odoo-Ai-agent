package com.transitops.service.impl;

import com.transitops.dto.DriverRequest;
import com.transitops.dto.DriverResponse;
import com.transitops.dto.DriverSearchRequest;
import com.transitops.dto.DriverUpdateRequest;
import com.transitops.entity.DriverEntity;
import com.transitops.entity.DriverStatus;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.mapper.DriverMapper;
import com.transitops.repository.DriverRepository;
import com.transitops.service.DriverService;
import com.transitops.validator.DriverAvailabilityValidator;
import com.transitops.validator.DriverValidator;
import com.transitops.validator.LicenseValidator;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;
    private final DriverMapper driverMapper;
    private final DriverValidator driverValidator;
    private final LicenseValidator licenseValidator;
    private final DriverAvailabilityValidator driverAvailabilityValidator;

    public DriverServiceImpl(
            DriverRepository driverRepository,
            DriverMapper driverMapper,
            DriverValidator driverValidator,
            LicenseValidator licenseValidator,
            DriverAvailabilityValidator driverAvailabilityValidator) {
        this.driverRepository = driverRepository;
        this.driverMapper = driverMapper;
        this.driverValidator = driverValidator;
        this.licenseValidator = licenseValidator;
        this.driverAvailabilityValidator = driverAvailabilityValidator;
    }

    @Override
    @Transactional
    public DriverResponse createDriver(DriverRequest request) {
        // Normalize license number
        String normalizedLicense = licenseValidator.normalize(request.licenseNumber());
        DriverRequest normalizedRequest = new DriverRequest(
            request.fullName(),
            normalizedLicense,
            request.licenseCategory(),
            request.licenseExpiry(),
            request.phoneNumber(),
            request.email(),
            request.emergencyContact(),
            request.safetyScore() == null ? 100 : request.safetyScore(),
            request.status() == null ? DriverStatus.AVAILABLE : request.status()
        );

        driverValidator.validateCreate(normalizedRequest);

        DriverEntity entity = driverMapper.toEntity(normalizedRequest);
        DriverEntity saved = driverRepository.save(entity);
        return driverMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public DriverResponse getDriverById(Long id) {
        DriverEntity driver = driverRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found with ID: " + id));
        return driverMapper.toResponse(driver);
    }

    @Override
    @Transactional(readOnly = true)
    public DriverResponse getDriverByEmail(String email) {
        DriverEntity driver = driverRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found with email: " + email));
        return driverMapper.toResponse(driver);
    }

    @Override
    @Transactional
    public DriverResponse updateDriver(Long id, DriverUpdateRequest request) {
        DriverEntity existing = driverRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found with ID: " + id));

        driverValidator.validateUpdate(request);

        // Validate status transition if it changed
        if (request.status() != null && request.status() != existing.getStatus()) {
            driverAvailabilityValidator.validateTransition(existing.getStatus(), request.status());
        }

        driverMapper.updateEntityFromRequest(request, existing);
        DriverEntity saved = driverRepository.save(existing);
        return driverMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteDriver(Long id) {
        DriverEntity existing = driverRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found with ID: " + id));
        driverRepository.delete(existing);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DriverResponse> searchDrivers(DriverSearchRequest searchRequest, Pageable pageable) {
        Specification<DriverEntity> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (searchRequest.name() != null && !searchRequest.name().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("fullName")), "%" + searchRequest.name().toLowerCase() + "%"));
            }

            if (searchRequest.licenseNumber() != null && !searchRequest.licenseNumber().isBlank()) {
                predicates.add(cb.equal(cb.upper(root.get("licenseNumber")), searchRequest.licenseNumber().toUpperCase()));
            }

            if (searchRequest.status() != null) {
                predicates.add(cb.equal(root.get("status"), searchRequest.status()));
            }

            if (searchRequest.licenseCategory() != null && !searchRequest.licenseCategory().isBlank()) {
                predicates.add(cb.equal(root.get("licenseCategory"), searchRequest.licenseCategory()));
            }

            if (searchRequest.minSafetyScore() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("safetyScore"), searchRequest.minSafetyScore()));
            }

            if (searchRequest.licenseExpiryBefore() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("licenseExpiry"), searchRequest.licenseExpiryBefore()));
            }

            if (searchRequest.licenseExpiryAfter() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("licenseExpiry"), searchRequest.licenseExpiryAfter()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return driverRepository.findAll(spec, pageable).map(driverMapper::toResponse);
    }

    @Override
    @Transactional
    public DriverResponse activateDriver(Long id) {
        return updateDriverStatus(id, DriverStatus.AVAILABLE);
    }

    @Override
    @Transactional
    public DriverResponse suspendDriver(Long id) {
        return updateDriverStatus(id, DriverStatus.SUSPENDED);
    }

    @Override
    @Transactional
    public DriverResponse offDutyDriver(Long id) {
        return updateDriverStatus(id, DriverStatus.OFF_DUTY);
    }

    private DriverResponse updateDriverStatus(Long id, DriverStatus targetStatus) {
        DriverEntity existing = driverRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found with ID: " + id));

        driverAvailabilityValidator.validateTransition(existing.getStatus(), targetStatus);
        existing.setStatus(targetStatus);
        DriverEntity saved = driverRepository.save(existing);
        return driverMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DriverResponse> getAvailableDrivers() {
        return driverRepository.findByStatusOrderByFullNameAsc(DriverStatus.AVAILABLE).stream()
            .map(driverMapper::toResponse)
            .toList();
    }
}
