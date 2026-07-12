package com.transitops.validator;

import com.transitops.exception.ConflictException;
import java.math.BigDecimal;
import org.springframework.stereotype.Component;

@Component
public class VehicleCapacityValidator {
    public void validate(BigDecimal capacity) {
        if (capacity == null) {
            throw new ConflictException("Capacity cannot be null.");
        }
        if (capacity.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ConflictException("Capacity must be greater than zero.");
        }
    }
}
