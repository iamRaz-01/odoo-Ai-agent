package com.transitops.exception;

public class InvalidDriverStatusException extends RuntimeException {
    public InvalidDriverStatusException(String message) {
        super(message);
    }
}
