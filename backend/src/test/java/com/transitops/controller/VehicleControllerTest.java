package com.transitops.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.transitops.dto.VehicleRequest;
import com.transitops.dto.VehicleResponse;
import com.transitops.entity.VehicleStatus;
import com.transitops.service.VehicleService;
import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
class VehicleControllerTest {

    private MockMvc mockMvc;

    @Mock
    private VehicleService vehicleService;

    @InjectMocks
    private VehicleController vehicleController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(vehicleController).build();
    }

    @Test
    void getVehicleById_Success() throws Exception {
        VehicleResponse response = new VehicleResponse(1L, "NY-1234", null, BigDecimal.TEN, BigDecimal.valueOf(50000), BigDecimal.ZERO, VehicleStatus.AVAILABLE, null, null);
        when(vehicleService.getVehicleById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/v1/vehicles/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.registrationNumber").value("NY-1234"))
                .andExpect(jsonPath("$.data.status").value("AVAILABLE"));
    }

    @Test
    void createVehicle_Success() throws Exception {
        VehicleRequest request = new VehicleRequest("NY-1234", 1L, BigDecimal.TEN, BigDecimal.valueOf(50000), BigDecimal.ZERO, VehicleStatus.AVAILABLE);
        VehicleResponse response = new VehicleResponse(1L, "NY-1234", null, BigDecimal.TEN, BigDecimal.valueOf(50000), BigDecimal.ZERO, VehicleStatus.AVAILABLE, null, null);
        when(vehicleService.createVehicle(any(VehicleRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/vehicles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.registrationNumber").value("NY-1234"));
    }
}
