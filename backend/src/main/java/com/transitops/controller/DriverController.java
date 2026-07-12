package com.transitops.controller;

import com.transitops.dto.*;
import com.transitops.entity.DriverStatus;
import com.transitops.security.TransitOpsUserDetails;
import com.transitops.service.DriverAvailabilityService;
import com.transitops.service.DriverService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/drivers")
@Tag(name = "Driver Management", description = "Endpoints for managing drivers, licenses, safety scores, and availability.")
public class DriverController {

    private final DriverService driverService;
    private final DriverAvailabilityService availabilityService;

    public DriverController(DriverService driverService, DriverAvailabilityService availabilityService) {
        this.driverService = driverService;
        this.availabilityService = availabilityService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SAFETY_OFFICER')")
    @Operation(summary = "Create a new driver", description = "Creates a new driver record. Accessible by ADMIN and SAFETY_OFFICER.")
    public ResponseEntity<ApiResponse<DriverResponse>> createDriver(@Valid @RequestBody DriverRequest request) {
        DriverResponse created = driverService.createDriver(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Driver created successfully.", created));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SAFETY_OFFICER', 'FLEET_MANAGER', 'DISPATCHER', 'FINANCE_OFFICER', 'DRIVER')")
    @Operation(summary = "Get driver by ID", description = "Retrieves a driver details by ID. DRIVER can only retrieve their own profile.")
    public ResponseEntity<ApiResponse<DriverResponse>> getDriverById(
            @PathVariable Long id,
            @AuthenticationPrincipal TransitOpsUserDetails userDetails) {
        
        if ("DRIVER".equals(userDetails.getRole())) {
            DriverResponse driver = driverService.getDriverByEmail(userDetails.getUsername());
            if (!driver.id().equals(id)) {
                throw new AccessDeniedException("You do not have permission to view other driver profiles.");
            }
            return ResponseEntity.ok(ApiResponse.success("Driver profile retrieved successfully.", driver));
        }
        
        return ResponseEntity.ok(ApiResponse.success("Driver details retrieved successfully.", driverService.getDriverById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SAFETY_OFFICER')")
    @Operation(summary = "Update an existing driver", description = "Updates an existing driver record. License number is immutable. Accessible by ADMIN and SAFETY_OFFICER.")
    public ResponseEntity<ApiResponse<DriverResponse>> updateDriver(
            @PathVariable Long id,
            @Valid @RequestBody DriverUpdateRequest request) {
        DriverResponse updated = driverService.updateDriver(id, request);
        return ResponseEntity.ok(ApiResponse.success("Driver updated successfully.", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SAFETY_OFFICER')")
    @Operation(summary = "Soft delete a driver", description = "Soft deletes a driver. The driver's deleted_at is updated. Accessible by ADMIN and SAFETY_OFFICER.")
    public ResponseEntity<ApiResponse<Void>> deleteDriver(@PathVariable Long id) {
        driverService.deleteDriver(id);
        return ResponseEntity.ok(ApiResponse.success("Driver deleted successfully.", null));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SAFETY_OFFICER', 'FLEET_MANAGER', 'DISPATCHER', 'FINANCE_OFFICER')")
    @Operation(summary = "List all drivers", description = "List all active drivers with pagination. Accessible by Admin, Fleet Manager, Dispatcher, Safety Officer, and Finance.")
    public ResponseEntity<ApiResponse<Page<DriverResponse>>> getAllDrivers(
            @PageableDefault(sort = "fullName") Pageable pageable) {
        DriverSearchRequest emptySearch = new DriverSearchRequest(null, null, null, null, null, null, null);
        Page<DriverResponse> drivers = driverService.searchDrivers(emptySearch, pageable);
        return ResponseEntity.ok(ApiResponse.success("Drivers retrieved successfully.", drivers));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'SAFETY_OFFICER', 'FLEET_MANAGER', 'DISPATCHER', 'FINANCE_OFFICER')")
    @Operation(summary = "Search and filter drivers", description = "Search and filter drivers dynamically by name, license number, category, safety score and expiry date.")
    public ResponseEntity<ApiResponse<Page<DriverResponse>>> searchDrivers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String licenseNumber,
            @RequestParam(required = false) DriverStatus status,
            @RequestParam(required = false) String licenseCategory,
            @RequestParam(required = false) Integer minSafetyScore,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate licenseExpiryBefore,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate licenseExpiryAfter,
            @PageableDefault(sort = "fullName") Pageable pageable) {

        DriverSearchRequest searchRequest = new DriverSearchRequest(
            name, licenseNumber, status, licenseCategory, minSafetyScore, licenseExpiryBefore, licenseExpiryAfter
        );
        Page<DriverResponse> results = driverService.searchDrivers(searchRequest, pageable);
        return ResponseEntity.ok(ApiResponse.success("Search results retrieved successfully.", results));
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasAnyRole('ADMIN', 'SAFETY_OFFICER')")
    @Operation(summary = "Activate a driver", description = "Transitions driver status to AVAILABLE. Accessible by ADMIN and SAFETY_OFFICER.")
    public ResponseEntity<ApiResponse<DriverResponse>> activateDriver(@PathVariable Long id) {
        DriverResponse updated = driverService.activateDriver(id);
        return ResponseEntity.ok(ApiResponse.success("Driver status updated to AVAILABLE.", updated));
    }

    @PatchMapping("/{id}/suspend")
    @PreAuthorize("hasAnyRole('ADMIN', 'SAFETY_OFFICER')")
    @Operation(summary = "Suspend a driver", description = "Transitions driver status to SUSPENDED. Accessible by ADMIN and SAFETY_OFFICER.")
    public ResponseEntity<ApiResponse<DriverResponse>> suspendDriver(@PathVariable Long id) {
        DriverResponse updated = driverService.suspendDriver(id);
        return ResponseEntity.ok(ApiResponse.success("Driver status updated to SUSPENDED.", updated));
    }

    @PatchMapping("/{id}/off-duty")
    @PreAuthorize("hasAnyRole('ADMIN', 'SAFETY_OFFICER')")
    @Operation(summary = "Set driver off-duty", description = "Transitions driver status to OFF_DUTY. Accessible by ADMIN and SAFETY_OFFICER.")
    public ResponseEntity<ApiResponse<DriverResponse>> offDutyDriver(@PathVariable Long id) {
        DriverResponse updated = driverService.offDutyDriver(id);
        return ResponseEntity.ok(ApiResponse.success("Driver status updated to OFF_DUTY.", updated));
    }

    @GetMapping("/{id}/availability")
    @PreAuthorize("hasAnyRole('ADMIN', 'SAFETY_OFFICER', 'FLEET_MANAGER', 'DISPATCHER', 'FINANCE_OFFICER')")
    @Operation(summary = "Check driver availability", description = "Evaluates whether a driver is eligible for dispatch (not suspended, license not expired, and state is AVAILABLE).")
    public ResponseEntity<ApiResponse<DriverAvailabilityResponse>> checkAvailability(@PathVariable Long id) {
        DriverAvailabilityResponse result = availabilityService.checkAvailability(id);
        return ResponseEntity.ok(ApiResponse.success("Availability evaluated successfully.", result));
    }

    @GetMapping("/available")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCE_OFFICER')")
    @Operation(summary = "Get available drivers", description = "Retrieves all active drivers with status AVAILABLE sorted alphabetically.")
    public ResponseEntity<ApiResponse<java.util.List<DriverResponse>>> getAvailableDrivers() {
        return ResponseEntity.ok(ApiResponse.success("Available drivers retrieved successfully.", driverService.getAvailableDrivers()));
    }
}
