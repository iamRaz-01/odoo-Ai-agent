package com.transitops.controller;

import com.transitops.dto.ApiResponse;
import com.transitops.dto.VehicleTypeResponse;
import com.transitops.service.VehicleTypeService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/vehicle-types")
@PreAuthorize("hasAnyRole('ADMIN', 'FLEET_MANAGER', 'DISPATCHER', 'FINANCE_OFFICER', 'SAFETY_OFFICER')")
public class VehicleTypeController {

    private final VehicleTypeService vehicleTypeService;

    public VehicleTypeController(VehicleTypeService vehicleTypeService) {
        this.vehicleTypeService = vehicleTypeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<VehicleTypeResponse>>> getAllVehicleTypes() {
        return ResponseEntity.ok(ApiResponse.success("Vehicle types retrieved successfully.", vehicleTypeService.getAllVehicleTypes()));
    }
}
