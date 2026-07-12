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
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public Instant getDeletedAt() { return deletedAt; }
    public void setDeletedAt(Instant deletedAt) { this.deletedAt = deletedAt; }
}
