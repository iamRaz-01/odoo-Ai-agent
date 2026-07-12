package com.transitops.controller;

import com.transitops.dto.ApiResponse;
import com.transitops.dto.VehicleRequest;
import com.transitops.dto.VehicleResponse;
import com.transitops.dto.VehicleUpdateRequest;
import com.transitops.entity.VehicleStatus;
import com.transitops.service.VehicleService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'DISPATCHER', 'FINANCE_OFFICER', 'SAFETY_OFFICER')")
    public ResponseEntity<ApiResponse<Page<VehicleResponse>>> getVehicles(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) VehicleStatus status,
            @RequestParam(required = false) Long typeId,
            @PageableDefault(sort = "registrationNumber") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success("Vehicles retrieved successfully.", vehicleService.getVehicles(search, status, typeId, pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'DISPATCHER', 'FINANCE_OFFICER', 'SAFETY_OFFICER')")
    public ResponseEntity<ApiResponse<VehicleResponse>> getVehicleById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Vehicle retrieved successfully.", vehicleService.getVehicleById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<ApiResponse<VehicleResponse>> createVehicle(@Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Vehicle created successfully.", vehicleService.createVehicle(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<ApiResponse<VehicleResponse>> updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody VehicleUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Vehicle updated successfully.", vehicleService.updateVehicle(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<ApiResponse<Void>> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok(ApiResponse.success("Vehicle deleted successfully.", null));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'DISPATCHER', 'FINANCE_OFFICER', 'SAFETY_OFFICER')")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> searchByRegistrationNumber(@RequestParam String query) {
        return ResponseEntity.ok(ApiResponse.success("Vehicles matching search query retrieved.", vehicleService.searchByRegistrationNumber(query)));
    }

    @GetMapping("/filter")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'DISPATCHER', 'FINANCE_OFFICER', 'SAFETY_OFFICER')")
    public ResponseEntity<ApiResponse<Page<VehicleResponse>>> filterVehicles(
            @RequestParam(required = false) VehicleStatus status,
            @RequestParam(required = false) Long typeId,
            @PageableDefault(sort = "registrationNumber") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success("Filtered vehicles retrieved.", vehicleService.getVehicles(null, status, typeId, pageable)));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'DISPATCHER', 'FINANCE_OFFICER', 'SAFETY_OFFICER')")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getVehiclesByStatus(@PathVariable VehicleStatus status) {
        return ResponseEntity.ok(ApiResponse.success("Vehicles with status retrieved.", vehicleService.getVehiclesByStatus(status)));
    }

    @GetMapping("/type/{typeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'DISPATCHER', 'FINANCE_OFFICER', 'SAFETY_OFFICER')")
    public ResponseEntity<ApiResponse<List<VehicleResponse>>> getVehiclesByType(@PathVariable Long typeId) {
        return ResponseEntity.ok(ApiResponse.success("Vehicles with type retrieved.", vehicleService.getVehiclesByTypeId(typeId)));
    }
}
