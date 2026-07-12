package com.transitops.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.transitops.dto.VehicleDocumentRequest;
import com.transitops.dto.VehicleDocumentResponse;
import com.transitops.entity.VehicleDocumentEntity;
import com.transitops.entity.VehicleEntity;
import com.transitops.exception.ResourceNotFoundException;
import com.transitops.mapper.VehicleDocumentMapper;
import com.transitops.repository.VehicleDocumentRepository;
import com.transitops.repository.VehicleRepository;
import com.transitops.validator.VehicleDocumentValidator;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class VehicleDocumentServiceImplTest {

    @Mock
    private VehicleDocumentRepository vehicleDocumentRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private VehicleDocumentMapper vehicleDocumentMapper;

    @Mock
    private VehicleDocumentValidator vehicleDocumentValidator;

    @InjectMocks
    private VehicleDocumentServiceImpl vehicleDocumentService;

    private VehicleEntity testVehicle;
    private VehicleDocumentEntity testDoc;
    private VehicleDocumentRequest testRequest;
    private VehicleDocumentResponse testResponse;

    @BeforeEach
    void setUp() {
        testVehicle = new VehicleEntity();
        testVehicle.setId(1L);

        testDoc = new VehicleDocumentEntity();
        testDoc.setId(10L);
        testDoc.setVehicle(testVehicle);
        testDoc.setName("INSURANCE");
        testDoc.setDocumentNumber("INS-777");
        testDoc.setExpiryDate(LocalDate.now().plusDays(10));
        testDoc.setFilePath("/docs/ins.pdf");

        testRequest = new VehicleDocumentRequest("INSURANCE", "INS-777", LocalDate.now().plusDays(10), "/docs/ins.pdf");
        testResponse = new VehicleDocumentResponse(10L, 1L, "INSURANCE", "INS-777", LocalDate.now().plusDays(10), "/docs/ins.pdf", null, null);
    }

    @Test
    void getDocumentsByVehicleId_Success() {
        when(vehicleRepository.existsById(1L)).thenReturn(true);
        when(vehicleDocumentRepository.findByVehicleId(1L)).thenReturn(List.of(testDoc));
        when(vehicleDocumentMapper.toResponse(testDoc)).thenReturn(testResponse);

        List<VehicleDocumentResponse> results = vehicleDocumentService.getDocumentsByVehicleId(1L);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals("INSURANCE", results.get(0).name());
    }

    @Test
    void uploadDocument_Success() {
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(testVehicle));
        when(vehicleDocumentMapper.toEntity(testRequest)).thenReturn(testDoc);
        when(vehicleDocumentRepository.save(testDoc)).thenReturn(testDoc);
        when(vehicleDocumentMapper.toResponse(testDoc)).thenReturn(testResponse);

        VehicleDocumentResponse result = vehicleDocumentService.uploadDocument(1L, testRequest);

        assertNotNull(result);
        verify(vehicleDocumentValidator).validate(testRequest);
        verify(vehicleDocumentRepository).save(testDoc);
    }

    @Test
    void deleteDocument_Success() {
        when(vehicleDocumentRepository.findById(10L)).thenReturn(Optional.of(testDoc));

        assertDoesNotThrow(() -> vehicleDocumentService.deleteDocument(10L));
        verify(vehicleDocumentRepository).delete(testDoc);
    }
}
