package com.transitops.validator;

import com.transitops.entity.DriverEntity;
import com.transitops.exception.ConflictException;
import com.transitops.repository.DriverRepository;
import java.util.Locale;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class LicenseValidator {

    private final DriverRepository driverRepository;

    public LicenseValidator(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    public String normalize(String licenseNumber) {
        if (licenseNumber == null) {
            throw new ConflictException("License number cannot be null.");
        }
        return licenseNumber.trim().toUpperCase(Locale.ROOT);
    }

    public void validateUnique(String licenseNumber) {
        String normalized = normalize(licenseNumber);
        if (normalized.isEmpty()) {
            throw new ConflictException("License number cannot be empty.");
        }
        Optional<DriverEntity> existing = driverRepository.findByLicenseNumber(normalized);
        if (existing.isPresent()) {
            throw new ConflictException("License number must be unique. A driver with this license already exists.");
        }
    }
}
