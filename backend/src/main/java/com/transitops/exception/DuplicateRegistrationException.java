package com.transitops.exception;

public class DuplicateRegistrationException extends ConflictException {
    public DuplicateRegistrationException(String registrationNumber) {
        super("Vehicle with registration number already exists: " + registrationNumber);
    }
}
