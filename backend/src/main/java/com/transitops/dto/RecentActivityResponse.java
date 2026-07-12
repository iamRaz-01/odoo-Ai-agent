package com.transitops.dto;

public record RecentActivityResponse(
    Long id,
    String action,
    String actor,
    String time,
    String type
) {}
