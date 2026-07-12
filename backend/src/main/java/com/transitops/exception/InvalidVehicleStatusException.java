package com.transitops.exception;

public class InvalidVehicleStatusException extends RuntimeException {
    public InvalidVehicleStatusException(String message) {
        super(message);
    }
}
