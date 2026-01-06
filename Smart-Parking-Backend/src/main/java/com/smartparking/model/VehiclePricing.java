package com.smartparking.model;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicle_pricing")
public class VehiclePricing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String vehicleType; // BIKE, CAR, SUV, TRUCK

    private Double hourlyRate;
    private Double dailyRate;
    private Double monthlyRate;
    private String description;
    private Boolean isActive = true;

    public VehiclePricing() {}

    public VehiclePricing(String vehicleType, Double hourlyRate, Double dailyRate, Double monthlyRate) {
        this.vehicleType = vehicleType;
        this.hourlyRate = hourlyRate;
        this.dailyRate = dailyRate;
        this.monthlyRate = monthlyRate;
        this.isActive = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public Double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }

    public Double getDailyRate() { return dailyRate; }
    public void setDailyRate(Double dailyRate) { this.dailyRate = dailyRate; }

    public Double getMonthlyRate() { return monthlyRate; }
    public void setMonthlyRate(Double monthlyRate) { this.monthlyRate = monthlyRate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
