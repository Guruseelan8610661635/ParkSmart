package com.smartparking.dto;

public class LocationPerformanceDTO {
    private Long locationId;
    private String locationName;
    private Double totalRevenue;
    private Integer totalBookings;
    private Double occupancyRate;
    private Double avgDuration;
    private Double avgRevenue;
    private Double utilizationRate;
    private Integer availableSlots;
    private Integer totalSlots;

    public LocationPerformanceDTO() {}

    public LocationPerformanceDTO(Long locationId, String locationName, Double totalRevenue, 
                                  Integer totalBookings, Double occupancyRate, Double avgDuration,
                                  Double avgRevenue, Double utilizationRate, Integer availableSlots, Integer totalSlots) {
        this.locationId = locationId;
        this.locationName = locationName;
        this.totalRevenue = totalRevenue;
        this.totalBookings = totalBookings;
        this.occupancyRate = occupancyRate;
        this.avgDuration = avgDuration;
        this.avgRevenue = avgRevenue;
        this.utilizationRate = utilizationRate;
        this.availableSlots = availableSlots;
        this.totalSlots = totalSlots;
    }

    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }
    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }
    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }
    public Integer getTotalBookings() { return totalBookings; }
    public void setTotalBookings(Integer totalBookings) { this.totalBookings = totalBookings; }
    public Double getOccupancyRate() { return occupancyRate; }
    public void setOccupancyRate(Double occupancyRate) { this.occupancyRate = occupancyRate; }
    public Double getAvgDuration() { return avgDuration; }
    public void setAvgDuration(Double avgDuration) { this.avgDuration = avgDuration; }
    public Double getAvgRevenue() { return avgRevenue; }
    public void setAvgRevenue(Double avgRevenue) { this.avgRevenue = avgRevenue; }
    public Double getUtilizationRate() { return utilizationRate; }
    public void setUtilizationRate(Double utilizationRate) { this.utilizationRate = utilizationRate; }
    public Integer getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(Integer availableSlots) { this.availableSlots = availableSlots; }
    public Integer getTotalSlots() { return totalSlots; }
    public void setTotalSlots(Integer totalSlots) { this.totalSlots = totalSlots; }
}
