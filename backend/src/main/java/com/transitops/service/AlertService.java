package com.transitops.service;

import com.transitops.dto.AlertResponse;
import java.util.List;

public interface AlertService {
    List<AlertResponse> getActiveAlerts();
}
