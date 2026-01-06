package com.smartparking.dto;

public class OccupancyDataPoint {
    private String timeLabel; // Hour, Date, Week, Month
    private Long timestamp;
    private Integer totalSlots;
    private Integer occupiedSlots;
    private Integer availableSlots;
    private Double occupancyPercentage;
    private Long bookingsCount;
    private Double averageSlotDurationMinutes;
    private Double peakOccupancy;

    public OccupancyDataPoint() {}

    public OccupancyDataPoint(String timeLabel, Integer totalSlots, Integer occupiedSlots) {
        this.timeLabel = timeLabel;
        this.totalSlots = totalSlots;
        this.occupiedSlots = occupiedSlots;
        this.availableSlots = totalSlots - occupiedSlots;
        this.occupancyPercentage = totalSlots > 0 ? 
                                    (double) occupiedSlots / totalSlots * 100 : 0;
        this.timestamp = System.currentTimeMillis();
    }

    public String getTimeLabel() { return timeLabel; }
    public void setTimeLabel(String timeLabel) { this.timeLabel = timeLabel; }

    public Long getTimestamp() { return timestamp; }
    public void setTimestamp(Long timestamp) { this.timestamp = timestamp; }

    public Integer getTotalSlots() { return totalSlots; }
    public void setTotalSlots(Integer totalSlots) { this.totalSlots = totalSlots; }

    public Integer getOccupiedSlots() { return occupiedSlots; }
    public void setOccupiedSlots(Integer occupiedSlots) { 
        this.occupiedSlots = occupiedSlots;
        if (totalSlots != null) {
            this.availableSlots = totalSlots - occupiedSlots;
            this.occupancyPercentage = totalSlots > 0 ? 
                                        (double) occupiedSlots / totalSlots * 100 : 0;
        }
    }

    public Integer getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(Integer availableSlots) { this.availableSlots = availableSlots; }

    public Double getOccupancyPercentage() { return occupancyPercentage; }
    public void setOccupancyPercentage(Double occupancyPercentage) { this.occupancyPercentage = occupancyPercentage; }

    public Long getBookingsCount() { return bookingsCount; }
    public void setBookingsCount(Long bookingsCount) { this.bookingsCount = bookingsCount; }

    public Double getAverageSlotDurationMinutes() { return averageSlotDurationMinutes; }
    public void setAverageSlotDurationMinutes(Double averageSlotDurationMinutes) { this.averageSlotDurationMinutes = averageSlotDurationMinutes; }

    public Double getPeakOccupancy() { return peakOccupancy; }
    public void setPeakOccupancy(Double peakOccupancy) { this.peakOccupancy = peakOccupancy; }
}
