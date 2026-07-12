package com.transitops.exception;

public class VehicleAlreadyRetiredException extends ConflictException {
    public VehicleAlreadyRetiredException(Long id) {
        super("Retired vehicle cannot be modified: " + id);
    }
}
