package com.transitops.mapper;

import com.transitops.dto.VehicleDocumentRequest;
import com.transitops.dto.VehicleDocumentResponse;
import com.transitops.entity.VehicleDocumentEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface VehicleDocumentMapper {
    @Mapping(source = "vehicle.id", target = "vehicleId")
    VehicleDocumentResponse toResponse(VehicleDocumentEntity entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "vehicle", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    VehicleDocumentEntity toEntity(VehicleDocumentRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "vehicle", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateEntityFromRequest(VehicleDocumentRequest request, @MappingTarget VehicleDocumentEntity entity);
}
