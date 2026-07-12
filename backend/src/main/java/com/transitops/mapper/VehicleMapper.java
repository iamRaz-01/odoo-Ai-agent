package com.transitops.mapper;

import com.transitops.dto.VehicleRequest;
import com.transitops.dto.VehicleResponse;
import com.transitops.dto.VehicleUpdateRequest;
import com.transitops.entity.VehicleEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {VehicleTypeMapper.class})
public interface VehicleMapper {
    VehicleResponse toResponse(VehicleEntity entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "vehicleType", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    VehicleEntity toEntity(VehicleRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "vehicleType", ignore = true)
    @Mapping(target = "registrationNumber", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateEntityFromRequest(VehicleUpdateRequest request, @MappingTarget VehicleEntity entity);
}
