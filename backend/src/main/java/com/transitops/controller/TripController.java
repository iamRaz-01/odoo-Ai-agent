package com.transitops.controller;

import com.transitops.dto.*;
import com.transitops.service.TripService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/trips")
@Tag(name = "Trip Management", description = "Endpoints for trip creation, driver/vehicle assignments, routing, and lifecycle states.")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'DRIVER')")
    @Operation(summary = "Get all trips", description = "Get list of trips with paging, sorting and filtering. Drivers only see their own assigned trips.")
    public ResponseEntity<ApiResponse<Page<TripResponse>>> getAllTrips(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate plannedDate,
            @RequestParam(required = false) String searchTerm,
            @PageableDefault(size = 10, sort = "plannedDate") Pageable pageable) {
        TripSearchRequest searchRequest = new TripSearchRequest(status, priority, plannedDate, searchTerm);
        Page<TripResponse> trips = tripService.findAll(searchRequest, pageable);
        return ResponseEntity.ok(ApiResponse.success("Trips retrieved successfully.", trips));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'DRIVER')")
    @Operation(summary = "Get trip by ID", description = "Retrieves trip details by ID. Driver can only access their own assigned trip details.")
    public ResponseEntity<ApiResponse<TripResponse>> getTripById(@PathVariable Long id) {
        TripResponse trip = tripService.findById(id);
        return ResponseEntity.ok(ApiResponse.success("Trip retrieved successfully.", trip));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    @Operation(summary = "Create a new trip", description = "Creates a new trip in DRAFT status. Accessible by ADMIN and FLEET_MANAGER.")
    public ResponseEntity<ApiResponse<TripResponse>> createTrip(@Valid @RequestBody TripRequest request) {
        TripResponse created = tripService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Trip created successfully.", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    @Operation(summary = "Update an existing trip", description = "Updates trip details. Cannot modify completed or cancelled trips. Accessible by ADMIN and FLEET_MANAGER.")
    public ResponseEntity<ApiResponse<TripResponse>> updateTrip(
            @PathVariable Long id,
            @Valid @RequestBody TripRequest request) {
        TripResponse updated = tripService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success("Trip updated successfully.", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    @Operation(summary = "Delete a trip", description = "Soft deletes a trip from the registry. Accessible by ADMIN and FLEET_MANAGER.")
    public ResponseEntity<ApiResponse<Void>> deleteTrip(@PathVariable Long id) {
        tripService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Trip deleted successfully.", null));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    @Operation(summary = "Assign driver and vehicle to trip", description = "Performs eligibility checks on driver status and vehicle capacity before assigning. Accessible by ADMIN and FLEET_MANAGER.")
    public ResponseEntity<ApiResponse<TripResponse>> assignTrip(
            @PathVariable Long id,
            @RequestBody TripAssignRequest request) {
        TripResponse updated = tripService.assign(id, request);
        return ResponseEntity.ok(ApiResponse.success("Driver and vehicle assigned successfully.", updated));
    }

    @PatchMapping("/{id}/start")
    @PreAuthorize("hasAnyRole('ADMIN', 'DRIVER')")
    @Operation(summary = "Start a trip", description = "Transitions trip status to IN_PROGRESS. Only the assigned Driver or Admin can perform this action.")
    public ResponseEntity<ApiResponse<TripResponse>> startTrip(@PathVariable Long id) {
        TripResponse updated = tripService.start(id);
        return ResponseEntity.ok(ApiResponse.success("Trip started successfully.", updated));
    }

    @PatchMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('ADMIN', 'DRIVER')")
    @Operation(summary = "Complete a trip", description = "Transitions trip status to COMPLETED. Only the assigned Driver or Admin can perform this action.")
    public ResponseEntity<ApiResponse<TripResponse>> completeTrip(@PathVariable Long id) {
        TripResponse updated = tripService.complete(id);
        return ResponseEntity.ok(ApiResponse.success("Trip completed successfully.", updated));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    @Operation(summary = "Cancel a trip", description = "Transitions trip status to CANCELLED. Completed trips cannot be cancelled. Accessible by ADMIN and FLEET_MANAGER.")
    public ResponseEntity<ApiResponse<TripResponse>> cancelTrip(@PathVariable Long id) {
        TripResponse updated = tripService.cancel(id);
        return ResponseEntity.ok(ApiResponse.success("Trip cancelled successfully.", updated));
    }
}
