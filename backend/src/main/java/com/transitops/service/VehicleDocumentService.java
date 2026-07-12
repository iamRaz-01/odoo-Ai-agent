package com.transitops.service;

import com.transitops.dto.VehicleDocumentRequest;
import com.transitops.dto.VehicleDocumentResponse;
import java.util.List;

public interface VehicleDocumentService {
    List<VehicleDocumentResponse> getDocumentsByVehicleId(Long vehicleId);
    VehicleDocumentResponse uploadDocument(Long vehicleId, VehicleDocumentRequest request);
    VehicleDocumentResponse updateDocument(Long documentId, VehicleDocumentRequest request);
    void deleteDocument(Long documentId);
    List<VehicleDocumentResponse> getExpiredDocuments();
}
