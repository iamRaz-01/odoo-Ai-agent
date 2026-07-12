package com.transitops.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record VehicleDocumentRequest(
    @NotBlank(message = "Document name is required.")
    @Size(max = 100, message = "Document name cannot exceed 100 characters.")
    String name,

    @NotBlank(message = "Document number is required.")
    @Size(max = 100, message = "Document number cannot exceed 100 characters.")
    String documentNumber,

    @NotNull(message = "Expiry date is required.")
    LocalDate expiryDate,

    @NotBlank(message = "File path is required.")
    @Size(max = 255, message = "File path cannot exceed 255 characters.")
    String filePath
) {}
