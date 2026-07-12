package com.transitops.validator;

import com.transitops.exception.ConflictException;
import java.util.Locale;
import org.springframework.stereotype.Component;

@Component
public class RegistrationNumberValidator {
    public String normalize(String registrationNumber) {
        if (registrationNumber == null) {
            throw new ConflictException("Registration number cannot be null.");
        }
        return registrationNumber.trim().toUpperCase(Locale.ROOT);
    }

    public void validate(String registrationNumber) {
        String normalized = normalize(registrationNumber);
        if (normalized.isEmpty()) {
            throw new ConflictException("Registration number cannot be empty.");
        }
        // Basic alphanumeric length check (e.g. typical registration numbers are 3 to 20 chars)
        if (normalized.length() < 3 || normalized.length() > 20) {
            throw new ConflictException("Registration number must be between 3 and 20 characters.");
        }
        if (!normalized.matches("^[A-Z0-9\\-]+$")) {
            throw new ConflictException("Registration number must contain only alphanumeric characters and hyphens.");
        }
    }
}
