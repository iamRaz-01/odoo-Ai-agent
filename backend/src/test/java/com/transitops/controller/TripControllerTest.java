package com.transitops.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.transitops.dto.*;
import com.transitops.service.TripService;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
class TripControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TripService tripService;

    @InjectMocks
    private TripController tripController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"pageable", "sort"})
    private interface PageImplMixIn {}

    @BeforeEach
    void setUp() {
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.addMixIn(PageImpl.class, PageImplMixIn.class);
        
        org.springframework.http.converter.json.MappingJackson2HttpMessageConverter converter = 
                new org.springframework.http.converter.json.MappingJackson2HttpMessageConverter();
        converter.setObjectMapper(objectMapper);
        
        mockMvc = MockMvcBuilders.standaloneSetup(tripController)
                .setCustomArgumentResolvers(new org.springframework.data.web.PageableHandlerMethodArgumentResolver())
                .setMessageConverters(converter)
                .build();
    }

    @Test
    void getAllTrips_Success() throws Exception {
        TripResponse response = new TripResponse(
                1L, "TRIP-1001", "Delivery Route 1", "Chicago -> Dallas",
                "HIGH", "Chicago", "Dallas", "Steel", BigDecimal.valueOf(10.0),
                LocalDate.now().plusDays(2), LocalTime.of(9, 0),
                20L, "REG-9910", 10L, "George Miller", "ASSIGNED",
                1L, "Fleet Manager", Instant.now(), Instant.now()
        );

        when(tripService.findAll(any(TripSearchRequest.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(Collections.singletonList(response)));

        mockMvc.perform(get("/api/v1/trips")
                .param("status", "ASSIGNED")
                .param("searchTerm", "Delivery"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].tripNumber").value("TRIP-1001"))
                .andExpect(jsonPath("$.data.content[0].tripName").value("Delivery Route 1"));
    }

    @Test
    void getTripById_Success() throws Exception {
        TripResponse response = new TripResponse(
                1L, "TRIP-1001", "Delivery Route 1", "Chicago -> Dallas",
                "HIGH", "Chicago", "Dallas", "Steel", BigDecimal.valueOf(10.0),
                LocalDate.now().plusDays(2), LocalTime.of(9, 0),
                20L, "REG-9910", 10L, "George Miller", "ASSIGNED",
                1L, "Fleet Manager", Instant.now(), Instant.now()
        );

        when(tripService.findById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/v1/trips/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.tripNumber").value("TRIP-1001"));
    }

    @Test
    void createTrip_Success() throws Exception {
        TripRequest request = new TripRequest(
                "Delivery Route 1", "Chicago -> Dallas", "HIGH",
                "Chicago", "Dallas", "Steel", BigDecimal.valueOf(10.0),
                LocalDate.now().plusDays(2), LocalTime.of(9, 0),
                20L, 10L
        );
        TripResponse response = new TripResponse(
                1L, "TRIP-1001", "Delivery Route 1", "Chicago -> Dallas",
                "HIGH", "Chicago", "Dallas", "Steel", BigDecimal.valueOf(10.0),
                LocalDate.now().plusDays(2), LocalTime.of(9, 0),
                20L, "REG-9910", 10L, "George Miller", "ASSIGNED",
                1L, "Fleet Manager", Instant.now(), Instant.now()
        );

        when(tripService.create(any(TripRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/trips")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.tripNumber").value("TRIP-1001"));
    }

    @Test
    void assignTrip_Success() throws Exception {
        TripAssignRequest assignRequest = new TripAssignRequest(10L, 20L);
        TripResponse response = new TripResponse(
                1L, "TRIP-1001", "Delivery Route 1", "Chicago -> Dallas",
                "HIGH", "Chicago", "Dallas", "Steel", BigDecimal.valueOf(10.0),
                LocalDate.now().plusDays(2), LocalTime.of(9, 0),
                20L, "REG-9910", 10L, "George Miller", "ASSIGNED",
                1L, "Fleet Manager", Instant.now(), Instant.now()
        );

        when(tripService.assign(eq(1L), any(TripAssignRequest.class))).thenReturn(response);

        mockMvc.perform(patch("/api/v1/trips/{id}/assign", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(assignRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("ASSIGNED"));
    }

    @Test
    void startTrip_Success() throws Exception {
        TripResponse response = new TripResponse(
                1L, "TRIP-1001", "Delivery Route 1", "Chicago -> Dallas",
                "HIGH", "Chicago", "Dallas", "Steel", BigDecimal.valueOf(10.0),
                LocalDate.now().plusDays(2), LocalTime.of(9, 0),
                20L, "REG-9910", 10L, "George Miller", "IN_PROGRESS",
                1L, "Fleet Manager", Instant.now(), Instant.now()
        );

        when(tripService.start(1L)).thenReturn(response);

        mockMvc.perform(patch("/api/v1/trips/{id}/start", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("IN_PROGRESS"));
    }

    @Test
    void completeTrip_Success() throws Exception {
        TripResponse response = new TripResponse(
                1L, "TRIP-1001", "Delivery Route 1", "Chicago -> Dallas",
                "HIGH", "Chicago", "Dallas", "Steel", BigDecimal.valueOf(10.0),
                LocalDate.now().plusDays(2), LocalTime.of(9, 0),
                20L, "REG-9910", 10L, "George Miller", "COMPLETED",
                1L, "Fleet Manager", Instant.now(), Instant.now()
        );

        when(tripService.complete(1L)).thenReturn(response);

        mockMvc.perform(patch("/api/v1/trips/{id}/complete", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("COMPLETED"));
    }

    @Test
    void cancelTrip_Success() throws Exception {
        TripResponse response = new TripResponse(
                1L, "TRIP-1001", "Delivery Route 1", "Chicago -> Dallas",
                "HIGH", "Chicago", "Dallas", "Steel", BigDecimal.valueOf(10.0),
                LocalDate.now().plusDays(2), LocalTime.of(9, 0),
                20L, "REG-9910", 10L, "George Miller", "CANCELLED",
                1L, "Fleet Manager", Instant.now(), Instant.now()
        );

        when(tripService.cancel(1L)).thenReturn(response);

        mockMvc.perform(patch("/api/v1/trips/{id}/cancel", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("CANCELLED"));
    }
}
