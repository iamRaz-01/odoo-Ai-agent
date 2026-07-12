package com.transitops.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.transitops.dto.FleetDashboardResponse;
import com.transitops.dto.FleetHealthResponse;
import com.transitops.dto.FleetSummaryResponse;
import com.transitops.service.FleetDashboardService;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
class FleetDashboardControllerTest {

    private MockMvc mockMvc;

    @Mock
    private FleetDashboardService fleetDashboardService;

    @InjectMocks
    private FleetDashboardController fleetDashboardController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(fleetDashboardController).build();
    }

    @Test
    void getFullDashboard_Success() throws Exception {
        FleetSummaryResponse summary = new FleetSummaryResponse(10, 8, 5, 2, 1, 0, 0, 2);
        FleetHealthResponse health = new FleetHealthResponse(100, 0, 0, 0);
        FleetDashboardResponse response = new FleetDashboardResponse(summary, health, 12.5, List.of(), List.of());

        when(fleetDashboardService.getFullDashboard()).thenReturn(response);

        mockMvc.perform(get("/api/v1/fleet/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.utilization").value(12.5))
                .andExpect(jsonPath("$.data.summary.totalFleet").value(10))
                .andExpect(jsonPath("$.data.health.score").value(100));
    }
}
