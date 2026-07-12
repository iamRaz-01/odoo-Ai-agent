package com.transitops.mapper;

import com.transitops.dto.VehicleTypeResponse;
import com.transitops.entity.VehicleTypeEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface VehicleTypeMapper {
    VehicleTypeResponse toResponse(VehicleTypeEntity entity);
}
