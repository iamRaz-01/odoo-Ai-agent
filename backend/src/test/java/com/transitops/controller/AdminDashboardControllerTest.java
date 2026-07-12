package com.transitops.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.transitops.dto.AdminDashboardResponse;
import com.transitops.service.AdminDashboardService;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
class AdminDashboardControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AdminDashboardService adminDashboardService;

    @InjectMocks
    private AdminDashboardController adminDashboardController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(adminDashboardController).build();
    }

    @Test
    void getDashboardStats_Success() throws Exception {
        AdminDashboardResponse response = new AdminDashboardResponse(
            5, 10, 8, 4, 3, 1, 0, 0, 1,
            Map.of("ADMIN", 2L, "FLEET_MANAGER", 3L),
            List.of()
        );

        when(adminDashboardService.getDashboardStats()).thenReturn(response);

        mockMvc.perform(get("/api/v1/admin/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalUsers").value(5))
                .andExpect(jsonPath("$.data.totalVehicles").value(10))
                .andExpect(jsonPath("$.data.roleCounts.ADMIN").value(2));
    }
}
