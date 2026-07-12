package com.transitops.dto;

import java.time.LocalDate;

public record TripSearchRequest(
    String status,
    String priority,
    LocalDate plannedDate,
    String searchTerm
) {}
