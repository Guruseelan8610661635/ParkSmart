package com.smartparking.dto;

public class PricingTierRequest {
    private String vehicleType; // BIKE, CAR, SUV, TRUCK
    private Double hourlyRate;
    private Double dailyRate;
    private Double monthlyRate;
    private String description;

    public PricingTierRequest() {}

    public PricingTierRequest(String vehicleType, Double hourlyRate, Double dailyRate, Double monthlyRate) {
        this.vehicleType = vehicleType;
        this.hourlyRate = hourlyRate;
        this.dailyRate = dailyRate;
        this.monthlyRate = monthlyRate;
    }

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
}
