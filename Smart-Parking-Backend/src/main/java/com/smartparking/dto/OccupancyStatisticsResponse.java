package com.smartparking.dto;

import java.util.List;

public class OccupancyStatisticsResponse {
    private Long locationId;
    private String locationName;
    private Long totalSlots;
    private Long currentlyOccupied;
    private Long currentlyAvailable;
    private Double currentOccupancyPercentage;
    private Double averageOccupancyPercentage;
    private Double peakOccupancyPercentage;
    private Long totalBookingsInPeriod;
    private Double averageSessionDurationMinutes;
    private Double totalRevenueInPeriod;
    private String timeGranularity;
    private List<OccupancyDataPoint> dataPoints;
    private Long fetchTimeMs;

    public OccupancyStatisticsResponse() {}

    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public Long getTotalSlots() { return totalSlots; }
    public void setTotalSlots(Long totalSlots) { this.totalSlots = totalSlots; }

    public Long getCurrentlyOccupied() { return currentlyOccupied; }
    public void setCurrentlyOccupied(Long currentlyOccupied) { this.currentlyOccupied = currentlyOccupied; }

    public Long getCurrentlyAvailable() { return currentlyAvailable; }
    public void setCurrentlyAvailable(Long currentlyAvailable) { this.currentlyAvailable = currentlyAvailable; }

    public Double getCurrentOccupancyPercentage() { return currentOccupancyPercentage; }
    public void setCurrentOccupancyPercentage(Double currentOccupancyPercentage) { this.currentOccupancyPercentage = currentOccupancyPercentage; }

    public Double getAverageOccupancyPercentage() { return averageOccupancyPercentage; }
    public void setAverageOccupancyPercentage(Double averageOccupancyPercentage) { this.averageOccupancyPercentage = averageOccupancyPercentage; }

    public Double getPeakOccupancyPercentage() { return peakOccupancyPercentage; }
    public void setPeakOccupancyPercentage(Double peakOccupancyPercentage) { this.peakOccupancyPercentage = peakOccupancyPercentage; }

    public Long getTotalBookingsInPeriod() { return totalBookingsInPeriod; }
    public void setTotalBookingsInPeriod(Long totalBookingsInPeriod) { this.totalBookingsInPeriod = totalBookingsInPeriod; }

    public Double getAverageSessionDurationMinutes() { return averageSessionDurationMinutes; }
    public void setAverageSessionDurationMinutes(Double averageSessionDurationMinutes) { this.averageSessionDurationMinutes = averageSessionDurationMinutes; }

    public Double getTotalRevenueInPeriod() { return totalRevenueInPeriod; }
    public void setTotalRevenueInPeriod(Double totalRevenueInPeriod) { this.totalRevenueInPeriod = totalRevenueInPeriod; }

    public String getTimeGranularity() { return timeGranularity; }
    public void setTimeGranularity(String timeGranularity) { this.timeGranularity = timeGranularity; }

    public List<OccupancyDataPoint> getDataPoints() { return dataPoints; }
    public void setDataPoints(List<OccupancyDataPoint> dataPoints) { this.dataPoints = dataPoints; }

    public Long getFetchTimeMs() { return fetchTimeMs; }
    public void setFetchTimeMs(Long fetchTimeMs) { this.fetchTimeMs = fetchTimeMs; }
}
