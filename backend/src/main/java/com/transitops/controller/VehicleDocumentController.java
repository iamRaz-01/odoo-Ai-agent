package com.transitops.controller;

import com.transitops.dto.ApiResponse;
import com.transitops.dto.VehicleDocumentRequest;
import com.transitops.dto.VehicleDocumentResponse;
import com.transitops.service.VehicleDocumentService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class VehicleDocumentController {

    private final VehicleDocumentService vehicleDocumentService;

    public VehicleDocumentController(VehicleDocumentService vehicleDocumentService) {
        this.vehicleDocumentService = vehicleDocumentService;
    }

    @GetMapping("/api/v1/vehicles/{id}/documents")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'DISPATCHER', 'FINANCE_OFFICER', 'SAFETY_OFFICER')")
    public ResponseEntity<ApiResponse<List<VehicleDocumentResponse>>> getDocumentsByVehicleId(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Vehicle documents retrieved successfully.", vehicleDocumentService.getDocumentsByVehicleId(id)));
    }

    @PostMapping("/api/v1/vehicles/{id}/documents")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<ApiResponse<VehicleDocumentResponse>> uploadDocument(
            @PathVariable Long id,
            @Valid @RequestBody VehicleDocumentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Vehicle document uploaded successfully.", vehicleDocumentService.uploadDocument(id, request)));
    }

    @PutMapping("/api/v1/documents/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<ApiResponse<VehicleDocumentResponse>> updateDocument(
            @PathVariable Long id,
            @Valid @RequestBody VehicleDocumentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Vehicle document updated successfully.", vehicleDocumentService.updateDocument(id, request)));
    }

    @DeleteMapping("/api/v1/documents/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER')")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(@PathVariable Long id) {
        vehicleDocumentService.deleteDocument(id);
        return ResponseEntity.ok(ApiResponse.success("Vehicle document deleted successfully.", null));
    }
}
