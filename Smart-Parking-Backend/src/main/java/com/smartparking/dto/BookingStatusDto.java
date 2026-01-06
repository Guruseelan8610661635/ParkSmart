package com.smartparking.dto;

import java.time.LocalDateTime;

public class BookingStatusDto {
    private Long bookingId;
    private String status; // ACTIVE, COMPLETED, CANCELLED
    private LocalDateTime lastUpdated;
    private Long lastUpdatedTimestamp;
    private String currentSlot;
    private String currentLocation;
    private Long durationSoFarMinutes;
    private Double estimatedFee;
    private Boolean isOvertime;

    public BookingStatusDto() {}

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { 
        this.lastUpdated = lastUpdated;
        if (lastUpdated != null) {
            this.lastUpdatedTimestamp = lastUpdated.atZone(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli();
        }
    }

    public Long getLastUpdatedTimestamp() { return lastUpdatedTimestamp; }
    public void setLastUpdatedTimestamp(Long lastUpdatedTimestamp) { this.lastUpdatedTimestamp = lastUpdatedTimestamp; }

    public String getCurrentSlot() { return currentSlot; }
    public void setCurrentSlot(String currentSlot) { this.currentSlot = currentSlot; }

    public String getCurrentLocation() { return currentLocation; }
    public void setCurrentLocation(String currentLocation) { this.currentLocation = currentLocation; }

    public Long getDurationSoFarMinutes() { return durationSoFarMinutes; }
    public void setDurationSoFarMinutes(Long durationSoFarMinutes) { this.durationSoFarMinutes = durationSoFarMinutes; }

    public Double getEstimatedFee() { return estimatedFee; }
    public void setEstimatedFee(Double estimatedFee) { this.estimatedFee = estimatedFee; }

    public Boolean getIsOvertime() { return isOvertime; }
    public void setIsOvertime(Boolean isOvertime) { this.isOvertime = isOvertime; }
}
