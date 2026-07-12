package com.transitops.exception;

public class VehicleDocumentExpiredException extends RuntimeException {
    public VehicleDocumentExpiredException(String message) {
        super(message);
    }
}
