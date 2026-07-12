package com.transitops.service;

import com.transitops.dto.DriverRequest;
import com.transitops.dto.DriverResponse;
import com.transitops.dto.DriverSearchRequest;
import com.transitops.dto.DriverUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DriverService {
    DriverResponse createDriver(DriverRequest request);
    DriverResponse getDriverById(Long id);
    DriverResponse getDriverByEmail(String email);
    DriverResponse updateDriver(Long id, DriverUpdateRequest request);
    void deleteDriver(Long id);
    Page<DriverResponse> searchDrivers(DriverSearchRequest searchRequest, Pageable pageable);
    DriverResponse activateDriver(Long id);
    DriverResponse suspendDriver(Long id);
    DriverResponse offDutyDriver(Long id);
    java.util.List<DriverResponse> getAvailableDrivers();
}
