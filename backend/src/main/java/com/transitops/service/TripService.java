package com.transitops.service;

import com.transitops.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TripService {
    Page<TripResponse> findAll(TripSearchRequest searchRequest, Pageable pageable);
    TripResponse findById(Long id);
    TripResponse create(TripRequest request);
    TripResponse update(Long id, TripRequest request);
    void delete(Long id);
    TripResponse assign(Long id, TripAssignRequest request);
    TripResponse start(Long id);
    TripResponse complete(Long id);
    TripResponse cancel(Long id);
}
