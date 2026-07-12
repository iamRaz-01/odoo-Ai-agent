package com.transitops.exception;

public class VehicleNotFoundException extends ResourceNotFoundException {
    public VehicleNotFoundException(Long id) {
        super("Vehicle not found with ID: " + id);
    }
}
