package com.transitops.exception;

public class TripValidationException extends RuntimeException {
    public TripValidationException(String message) {
        super(message);
    }
}
