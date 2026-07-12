package com.transitops.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.transitops.dto.VehicleRequest;
import com.transitops.dto.VehicleResponse;
import com.transitops.dto.VehicleUpdateRequest;
import com.transitops.entity.VehicleEntity;
import com.transitops.entity.VehicleStatus;
import com.transitops.entity.VehicleTypeEntity;
import com.transitops.exception.DuplicateRegistrationException;
import com.transitops.exception.VehicleAlreadyRetiredException;
import com.transitops.exception.VehicleNotFoundException;
import com.transitops.mapper.VehicleMapper;
import com.transitops.repository.VehicleRepository;
import com.transitops.service.VehicleTypeService;
import com.transitops.validator.RegistrationNumberValidator;
import com.transitops.validator.VehicleCapacityValidator;
import com.transitops.validator.VehicleStatusValidator;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class VehicleServiceImplTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private VehicleTypeService vehicleTypeService;

    @Mock
    private VehicleMapper vehicleMapper;

    @Mock
    private RegistrationNumberValidator registrationNumberValidator;

    @Mock
    private VehicleCapacityValidator vehicleCapacityValidator;

    @Mock
    private VehicleStatusValidator vehicleStatusValidator;

    @InjectMocks
    private VehicleServiceImpl vehicleService;

    private VehicleTypeEntity testType;
    private VehicleEntity testVehicle;
    private VehicleRequest testRequest;
    private VehicleResponse testResponse;

    @BeforeEach
    void setUp() {
        testType = new VehicleTypeEntity();
        testType.setId(1L);
        testType.setName("TRUCK");

        testVehicle = new VehicleEntity();
        testVehicle.setId(1L);
        testVehicle.setRegistrationNumber("NY-1234");
        testVehicle.setVehicleType(testType);
        testVehicle.setCapacity(BigDecimal.TEN);
        testVehicle.setAcquisitionCost(BigDecimal.valueOf(50000));
        testVehicle.setOdometer(BigDecimal.ZERO);
        testVehicle.setStatus(VehicleStatus.AVAILABLE);

        testRequest = new VehicleRequest("NY-1234", 1L, BigDecimal.TEN, BigDecimal.valueOf(50000), BigDecimal.ZERO, VehicleStatus.AVAILABLE);
        testResponse = new VehicleResponse(1L, "NY-1234", null, BigDecimal.TEN, BigDecimal.valueOf(50000), BigDecimal.ZERO, VehicleStatus.AVAILABLE, null, null);
    }

    @Test
    void getVehicleById_Success() {
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(testVehicle));
        when(vehicleMapper.toResponse(testVehicle)).thenReturn(testResponse);

        VehicleResponse result = vehicleService.getVehicleById(1L);

        assertNotNull(result);
        assertEquals("NY-1234", result.registrationNumber());
        verify(vehicleRepository).findById(1L);
    }

    @Test
    void getVehicleById_NotFound() {
        when(vehicleRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(VehicleNotFoundException.class, () -> vehicleService.getVehicleById(99L));
    }

    @Test
    void createVehicle_Success() {
        when(registrationNumberValidator.normalize(anyString())).thenReturn("NY-1234");
        when(vehicleRepository.existsByRegistrationNumberIgnoreCase("NY-1234")).thenReturn(false);
        when(vehicleTypeService.getTypeEntityById(1L)).thenReturn(testType);
        when(vehicleMapper.toEntity(any(VehicleRequest.class))).thenReturn(testVehicle);
        when(vehicleRepository.save(any(VehicleEntity.class))).thenReturn(testVehicle);
        when(vehicleMapper.toResponse(any(VehicleEntity.class))).thenReturn(testResponse);

        VehicleResponse result = vehicleService.createVehicle(testRequest);

        assertNotNull(result);
        verify(registrationNumberValidator).validate(anyString());
        verify(vehicleCapacityValidator).validate(any(BigDecimal.class));
        verify(vehicleStatusValidator).validateTransition(isNull(), any(VehicleStatus.class));
        verify(vehicleRepository).save(any(VehicleEntity.class));
    }

    @Test
    void createVehicle_DuplicateRegistration() {
        when(registrationNumberValidator.normalize(anyString())).thenReturn("NY-1234");
        when(vehicleRepository.existsByRegistrationNumberIgnoreCase("NY-1234")).thenReturn(true);

        assertThrows(DuplicateRegistrationException.class, () -> vehicleService.createVehicle(testRequest));
    }

    @Test
    void updateVehicle_Success_AsAdmin() {
        setupSecurityContext("ROLE_ADMIN");
        testVehicle.setStatus(VehicleStatus.RETIRED);

        VehicleUpdateRequest updateRequest = new VehicleUpdateRequest(1L, BigDecimal.TEN, BigDecimal.valueOf(55000), BigDecimal.valueOf(100), VehicleStatus.RETIRED);

        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(testVehicle));
        when(vehicleTypeService.getTypeEntityById(1L)).thenReturn(testType);
        when(vehicleRepository.save(testVehicle)).thenReturn(testVehicle);
        when(vehicleMapper.toResponse(testVehicle)).thenReturn(testResponse);

        VehicleResponse result = vehicleService.updateVehicle(1L, updateRequest);

        assertNotNull(result);
        verify(vehicleRepository).save(testVehicle);
        clearSecurityContext();
    }

    @Test
    void updateVehicle_Failure_AsManagerOnRetired() {
        setupSecurityContext("ROLE_FLEET_MANAGER");
        testVehicle.setStatus(VehicleStatus.RETIRED);

        VehicleUpdateRequest updateRequest = new VehicleUpdateRequest(1L, BigDecimal.TEN, BigDecimal.valueOf(55000), BigDecimal.valueOf(100), VehicleStatus.RETIRED);

        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(testVehicle));

        assertThrows(VehicleAlreadyRetiredException.class, () -> vehicleService.updateVehicle(1L, updateRequest));
        clearSecurityContext();
    }

    @Test
    void deleteVehicle_Success() {
        setupSecurityContext("ROLE_ADMIN");
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(testVehicle));

        assertDoesNotThrow(() -> vehicleService.deleteVehicle(1L));
        verify(vehicleRepository).delete(testVehicle);
        clearSecurityContext();
    }

    @Test
    void getVehicles_Pagination() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<VehicleEntity> page = new PageImpl<>(List.of(testVehicle));
        when(vehicleRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(page);
        when(vehicleMapper.toResponse(testVehicle)).thenReturn(testResponse);

        Page<VehicleResponse> result = vehicleService.getVehicles("NY", null, null, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }

    private void setupSecurityContext(String role) {
        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);
        doReturn(List.of(new SimpleGrantedAuthority(role))).when(authentication).getAuthorities();
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    private void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }
}
