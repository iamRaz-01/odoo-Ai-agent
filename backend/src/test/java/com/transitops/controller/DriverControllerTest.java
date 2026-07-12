package com.transitops.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.transitops.dto.DriverAvailabilityResponse;
import com.transitops.dto.DriverRequest;
import com.transitops.dto.DriverResponse;
import com.transitops.entity.DriverStatus;
import com.transitops.security.TransitOpsUserDetails;
import com.transitops.service.DriverAvailabilityService;
import com.transitops.service.DriverService;
import java.time.LocalDate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@ExtendWith(MockitoExtension.class)
class DriverControllerTest {

    private MockMvc mockMvc;

    @Mock
    private DriverService driverService;

    @Mock
    private DriverAvailabilityService availabilityService;

    @InjectMocks
    private DriverController driverController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private TransitOpsUserDetails mockedUser;

    @BeforeEach
    void setUp() {
        objectMapper.registerModule(new JavaTimeModule());
        mockedUser = new TransitOpsUserDetails(99L, "admin@example.com", "hash", true, "ADMIN");
        
        mockMvc = MockMvcBuilders.standaloneSetup(driverController)
            .setCustomArgumentResolvers(new HandlerMethodArgumentResolver() {
                @Override
                public boolean supportsParameter(MethodParameter parameter) {
                    return parameter.getParameterType().equals(TransitOpsUserDetails.class);
                }

                @Override
                public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                              NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
                    return mockedUser;
                }
            })
            .build();
    }

    @Test
    void createDriver_Success() throws Exception {
        DriverRequest request = new DriverRequest(
            "John Doe", "LIC-1234", "CLASS-A", LocalDate.now().plusYears(1),
            "+1234567890", "john@example.com", "Jane Doe", 100, DriverStatus.AVAILABLE
        );
        DriverResponse response = new DriverResponse(
            1L, "John Doe", "LIC-1234", "CLASS-A", LocalDate.now().plusYears(1),
            "+1234567890", "john@example.com", "Jane Doe", 100, DriverStatus.AVAILABLE, null, null
        );
        when(driverService.createDriver(any(DriverRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/drivers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fullName").value("John Doe"))
                .andExpect(jsonPath("$.data.licenseNumber").value("LIC-1234"));
    }

    @Test
    void getDriverById_AdminSuccess() throws Exception {
        DriverResponse response = new DriverResponse(
            1L, "John Doe", "LIC-1234", "CLASS-A", LocalDate.now().plusYears(1),
            "+1234567890", "john@example.com", "Jane Doe", 100, DriverStatus.AVAILABLE, null, null
        );
        when(driverService.getDriverById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/v1/drivers/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fullName").value("John Doe"));
    }

    @Test
    void getDriverById_DriverOwnProfileSuccess() throws Exception {
        DriverResponse response = new DriverResponse(
            1L, "John Doe", "LIC-1234", "CLASS-A", LocalDate.now().plusYears(1),
            "+1234567890", "john@example.com", "Jane Doe", 100, DriverStatus.AVAILABLE, null, null
        );
        // Mock driver role
        mockedUser = new TransitOpsUserDetails(1L, "john@example.com", "hash", true, "DRIVER");
        when(driverService.getDriverByEmail("john@example.com")).thenReturn(response);

        mockMvc.perform(get("/api/v1/drivers/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fullName").value("John Doe"));
    }

    @Test
    void getDriverAvailability_Success() throws Exception {
        DriverAvailabilityResponse availability = new DriverAvailabilityResponse(1L, true, null);
        when(availabilityService.checkAvailability(1L)).thenReturn(availability);

        mockMvc.perform(get("/api/v1/drivers/{id}/availability", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.driverId").value(1))
                .andExpect(jsonPath("$.data.available").value(true));
    }
}
