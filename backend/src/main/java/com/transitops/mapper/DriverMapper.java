package com.transitops.mapper;

import com.transitops.dto.DriverRequest;
import com.transitops.dto.DriverResponse;
import com.transitops.dto.DriverUpdateRequest;
import com.transitops.entity.DriverEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DriverMapper {
    DriverResponse toResponse(DriverEntity entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    DriverEntity toEntity(DriverRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "licenseNumber", ignore = true) // licenseNumber is immutable and not in DriverUpdateRequest
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateEntityFromRequest(DriverUpdateRequest request, @MappingTarget DriverEntity entity);
}
