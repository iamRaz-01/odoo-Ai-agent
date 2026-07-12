package com.transitops.validator;

import com.transitops.dto.VehicleDocumentRequest;
import com.transitops.exception.ConflictException;
import java.time.LocalDate;
import org.springframework.stereotype.Component;

@Component
public class VehicleDocumentValidator {
    public void validate(VehicleDocumentRequest request) {
        if (request.name() == null || request.name().trim().isEmpty()) {
            throw new ConflictException("Document name cannot be empty.");
        }
        if (request.documentNumber() == null || request.documentNumber().trim().isEmpty()) {
            throw new ConflictException("Document number cannot be empty.");
        }
        if (request.expiryDate() == null) {
            throw new ConflictException("Document expiry date is mandatory.");
        }
        
        // Normalize names for standard checks
        String nameUpper = request.name().toUpperCase();
        if (nameUpper.contains("INSURANCE") || nameUpper.contains("REGISTRATION") || 
            nameUpper.contains("POLLUTION") || nameUpper.contains("PERMIT")) {
            if (request.expiryDate() == null) {
                throw new ConflictException("Expiry date is mandatory for " + request.name());
            }
        }
    }
}
