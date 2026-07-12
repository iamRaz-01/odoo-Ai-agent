package com.transitops.validator;

import com.transitops.exception.ConflictException;
import org.springframework.stereotype.Component;

@Component
public class SafetyScoreValidator {

    public void validate(Integer score) {
        if (score == null) {
            return; // allowed to be null/default
        }
        if (score < 0 || score > 100) {
            throw new ConflictException("Safety score must be between 0 and 100.");
        }
    }
}
