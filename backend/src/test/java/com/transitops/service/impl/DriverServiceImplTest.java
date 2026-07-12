package com.transitops.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.transitops.dto.DriverRequest;
import com.transitops.dto.DriverResponse;
import com.transitops.dto.DriverSearchRequest;
import com.transitops.dto.DriverUpdateRequest;
import com.transitops.entity.DriverEntity;
import com.transitops.entity.DriverStatus;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.mapper.DriverMapper;
import com.transitops.repository.DriverRepository;
import com.transitops.validator.DriverAvailabilityValidator;
import com.transitops.validator.DriverValidator;
import com.transitops.validator.LicenseValidator;
import java.time.LocalDate;
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
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

@ExtendWith(MockitoExtension.class)
class DriverServiceImplTest {

    @Mock
    private DriverRepository driverRepository;

    @Mock
    private DriverMapper driverMapper;

    @Mock
    private DriverValidator driverValidator;

    @Mock
    private LicenseValidator licenseValidator;

    @Mock
    private DriverAvailabilityValidator driverAvailabilityValidator;

    @InjectMocks
    private DriverServiceImpl driverService;

    private DriverEntity driverEntity;
    private DriverResponse driverResponse;

    @BeforeEach
    void setUp() {
        driverEntity = new DriverEntity();
        driverEntity.setId(1L);
        driverEntity.setFullName("John Doe");
        driverEntity.setLicenseNumber("LIC-1234");
        driverEntity.setStatus(DriverStatus.AVAILABLE);

        driverResponse = new DriverResponse(
            1L, "John Doe", "LIC-1234", "CLASS-A", LocalDate.now().plusYears(1),
            "+1234567890", "john@example.com", "Jane Doe", 100, DriverStatus.AVAILABLE, null, null
        );
    }

    @Test
    void getDriverById_Success() {
        when(driverRepository.findById(1L)).thenReturn(Optional.of(driverEntity));
        when(driverMapper.toResponse(driverEntity)).thenReturn(driverResponse);

        DriverResponse result = driverService.getDriverById(1L);

        assertNotNull(result);
        assertEquals("John Doe", result.fullName());
        verify(driverRepository, times(1)).findById(1L);
    }

    @Test
    void getDriverById_NotFound() {
        when(driverRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> driverService.getDriverById(1L));
    }

    @Test
    void createDriver_Success() {
        DriverRequest request = new DriverRequest(
            "John Doe", "lic-1234", "CLASS-A", LocalDate.now().plusYears(1),
            "+1234567890", "john@example.com", "Jane Doe", 100, DriverStatus.AVAILABLE
        );
        when(licenseValidator.normalize("lic-1234")).thenReturn("LIC-1234");
        when(driverMapper.toEntity(any(DriverRequest.class))).thenReturn(driverEntity);
        when(driverRepository.save(driverEntity)).thenReturn(driverEntity);
        when(driverMapper.toResponse(driverEntity)).thenReturn(driverResponse);

        DriverResponse result = driverService.createDriver(request);

        assertNotNull(result);
        assertEquals("LIC-1234", result.licenseNumber());
        verify(licenseValidator, times(1)).normalize("lic-1234");
        verify(driverValidator, times(1)).validateCreate(any(DriverRequest.class));
        verify(driverRepository, times(1)).save(driverEntity);
    }

    @Test
    void updateDriver_Success() {
        DriverUpdateRequest request = new DriverUpdateRequest(
            "John Doe II", "CLASS-B", LocalDate.now().plusYears(2),
            "+1234567890", "john@example.com", "Jane Doe", 95, DriverStatus.ASSIGNED
        );
        when(driverRepository.findById(1L)).thenReturn(Optional.of(driverEntity));
        when(driverRepository.save(driverEntity)).thenReturn(driverEntity);
        when(driverMapper.toResponse(driverEntity)).thenReturn(new DriverResponse(
            1L, "John Doe II", "LIC-1234", "CLASS-B", LocalDate.now().plusYears(2),
            "+1234567890", "john@example.com", "Jane Doe", 95, DriverStatus.ASSIGNED, null, null
        ));

        DriverResponse result = driverService.updateDriver(1L, request);

        assertNotNull(result);
        assertEquals("John Doe II", result.fullName());
        assertEquals(DriverStatus.ASSIGNED, result.status());
        verify(driverAvailabilityValidator, times(1)).validateTransition(DriverStatus.AVAILABLE, DriverStatus.ASSIGNED);
    }

    @Test
    void deleteDriver_Success() {
        when(driverRepository.findById(1L)).thenReturn(Optional.of(driverEntity));

        driverService.deleteDriver(1L);

        verify(driverRepository, times(1)).delete(driverEntity);
    }

    @Test
    void searchDrivers_Success() {
        DriverSearchRequest search = new DriverSearchRequest("John", null, null, null, null, null, null);
        PageImpl<DriverEntity> page = new PageImpl<>(List.of(driverEntity));
        when(driverRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);
        when(driverMapper.toResponse(driverEntity)).thenReturn(driverResponse);

        Page<DriverResponse> result = driverService.searchDrivers(search, Pageable.unpaged());

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }
}
