package com.transitops.mapper;

import com.transitops.dto.TripResponse;
import com.transitops.entity.TripEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TripMapper {
    @Mapping(target = "vehicleId", source = "vehicle.id")
    @Mapping(target = "vehicleRegistrationNumber", source = "vehicle.registrationNumber")
    @Mapping(target = "driverId", source = "driver.id")
    @Mapping(target = "driverName", source = "driver.fullName")
    @Mapping(target = "createdByUserId", source = "createdBy.id")
    @Mapping(target = "createdByUserName", expression = "java(entity.getCreatedBy() != null ? entity.getCreatedBy().getFirstName() + \" \" + entity.getCreatedBy().getLastName() : null)")
    TripResponse toResponse(TripEntity entity);
}
