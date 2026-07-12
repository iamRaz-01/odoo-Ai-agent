package com.transitops.exception;

import com.transitops.dto.ApiError;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class) ResponseEntity<ApiError> notFound(ResourceNotFoundException e) { return error(HttpStatus.NOT_FOUND, "RESOURCE_NOT_FOUND", e.getMessage()); }
    @ExceptionHandler({DuplicateEmailException.class, ConflictException.class}) ResponseEntity<ApiError> conflict(RuntimeException e) { return error(HttpStatus.CONFLICT, "CONFLICT", e.getMessage()); }
    @ExceptionHandler({InvalidCredentialsException.class, UnauthorizedException.class}) ResponseEntity<ApiError> unauthorized(RuntimeException e) { return error(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", e.getMessage()); }
    @ExceptionHandler(AccessDeniedException.class) ResponseEntity<ApiError> forbidden(AccessDeniedException e) { return error(HttpStatus.FORBIDDEN, "ACCESS_DENIED", "You do not have permission to perform this action."); }
    @ExceptionHandler({MethodArgumentNotValidException.class, ConstraintViolationException.class}) ResponseEntity<ApiError> validation(Exception e) { return error(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", "The request contains invalid data."); }
    @ExceptionHandler({InvalidVehicleStatusException.class, VehicleDocumentExpiredException.class, InvalidDriverStatusException.class, TripValidationException.class}) ResponseEntity<ApiError> badRequest(RuntimeException e) { return error(HttpStatus.BAD_REQUEST, "BAD_REQUEST", e.getMessage()); }
    @ExceptionHandler(Exception.class) ResponseEntity<ApiError> fallback(Exception e) { log.error("Unhandled exception occurred", e); return error(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", "An unexpected error occurred."); }
    private ResponseEntity<ApiError> error(HttpStatus status, String code, String message) { return ResponseEntity.status(status).body(ApiError.of(code, message)); }
}
