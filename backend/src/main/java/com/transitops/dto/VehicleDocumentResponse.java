package com.transitops.dto;

import java.time.LocalDate;
import java.time.Instant;

public record VehicleDocumentResponse(
    Long id,
    Long vehicleId,
    String name,
    String documentNumber,
    LocalDate expiryDate,
    String filePath,
    Instant createdAt,
    Instant updatedAt
) {}
