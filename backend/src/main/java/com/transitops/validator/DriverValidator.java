package com.transitops.validator;

import com.transitops.dto.DriverRequest;
import com.transitops.dto.DriverUpdateRequest;
import com.transitops.exception.ConflictException;
import java.time.LocalDate;
import org.springframework.stereotype.Component;

@Component
public class DriverValidator {

    private final LicenseValidator licenseValidator;
    private final SafetyScoreValidator safetyScoreValidator;

    public DriverValidator(LicenseValidator licenseValidator, SafetyScoreValidator safetyScoreValidator) {
        this.licenseValidator = licenseValidator;
        this.safetyScoreValidator = safetyScoreValidator;
    }

    public void validateCreate(DriverRequest request) {
        if (request.fullName().trim().length() < 2 || request.fullName().trim().length() > 120) {
            throw new ConflictException("Full name must be between 2 and 120 characters.");
        }
        if (request.licenseExpiry().isBefore(LocalDate.now()) || request.licenseExpiry().isEqual(LocalDate.now())) {
            throw new ConflictException("License expiry date must be in the future.");
        }
        licenseValidator.validateUnique(request.licenseNumber());
        safetyScoreValidator.validate(request.safetyScore());
    }

    public void validateUpdate(DriverUpdateRequest request) {
        if (request.fullName().trim().length() < 2 || request.fullName().trim().length() > 120) {
            throw new ConflictException("Full name must be between 2 and 120 characters.");
        }
        if (request.licenseExpiry().isBefore(LocalDate.now()) || request.licenseExpiry().isEqual(LocalDate.now())) {
            throw new ConflictException("License expiry date must be in the future.");
        }
        safetyScoreValidator.validate(request.safetyScore());
    }
}
