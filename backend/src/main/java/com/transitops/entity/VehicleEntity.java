package com.transitops.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "vehicle", indexes = {
    @Index(name = "idx_vehicle_status", columnList = "status"),
    @Index(name = "idx_vehicle_type", columnList = "vehicle_type_id"),
    @Index(name = "idx_vehicle_status_type", columnList = "status, vehicle_type_id")
})
@SQLDelete(sql = "UPDATE vehicle SET deleted_at = NOW() WHERE vehicle_id = ?")
@SQLRestriction("deleted_at IS NULL")
public class VehicleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vehicle_id")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "vehicle_type_id", nullable = false)
    private VehicleTypeEntity vehicleType;

    @Column(name = "registration_number", nullable = false, unique = true, length = 50)
    private String registrationNumber;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal capacity;

    @Column(name = "acquisition_cost", nullable = false, precision = 15, scale = 2)
    private BigDecimal acquisitionCost;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal odometer = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VehicleStatus status = VehicleStatus.AVAILABLE;

    @Column(length = 100)
    private String name;

    @Column(length = 100)
    private String model;

    @Column(name = "fuel_type", length = 50)
    private String fuelType;

    @Column(name = "manufacturing_year")
    private Integer manufacturingYear;

    @Column(name = "engine_number", length = 100)
    private String engineNumber;

    @Column(name = "chassis_number", length = 100)
    private String chassisNumber;

    @Column(name = "assigned_depot", length = 100)
    private String assignedDepot;

    @Column(name = "maximum_capacity", precision = 10, scale = 2)
    private BigDecimal maximumCapacity;

    @Column(name = "driver_id")
    private Long driverId;

    @Column(name = "fuel_level", precision = 5, scale = 2)
    private BigDecimal fuelLevel;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public VehicleTypeEntity getVehicleType() { return vehicleType; }
    public void setVehicleType(VehicleTypeEntity vehicleType) { this.vehicleType = vehicleType; }
    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }
    public BigDecimal getCapacity() { return capacity; }
    public void setCapacity(BigDecimal capacity) { this.capacity = capacity; }
    public BigDecimal getAcquisitionCost() { return acquisitionCost; }
    public void setAcquisitionCost(BigDecimal acquisitionCost) { this.acquisitionCost = acquisitionCost; }
    public BigDecimal getOdometer() { return odometer; }
    public void setOdometer(BigDecimal odometer) { this.odometer = odometer; }
    public VehicleStatus getStatus() { return status; }
    public void setStatus(VehicleStatus status) { this.status = status; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }
    public Integer getManufacturingYear() { return manufacturingYear; }
    public void setManufacturingYear(Integer manufacturingYear) { this.manufacturingYear = manufacturingYear; }
    public String getEngineNumber() { return engineNumber; }
    public void setEngineNumber(String engineNumber) { this.engineNumber = engineNumber; }
    public String getChassisNumber() { return chassisNumber; }
    public void setChassisNumber(String chassisNumber) { this.chassisNumber = chassisNumber; }
    public String getAssignedDepot() { return assignedDepot; }
    public void setAssignedDepot(String assignedDepot) { this.assignedDepot = assignedDepot; }
    public BigDecimal getMaximumCapacity() { return maximumCapacity; }
    public void setMaximumCapacity(BigDecimal maximumCapacity) { this.maximumCapacity = maximumCapacity; }
    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }
    public BigDecimal getFuelLevel() { return fuelLevel; }
    public void setFuelLevel(BigDecimal fuelLevel) { this.fuelLevel = fuelLevel; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public Instant getDeletedAt() { return deletedAt; }
    public void setDeletedAt(Instant deletedAt) { this.deletedAt = deletedAt; }
}
