package com.smartparking.dto;

import java.time.LocalDateTime;
import java.time.Duration;

public class BookingDetailDto {
    private Long id;
    private Long slotId;
    private String slotNumber;
    private Long locationId;
    private String locationName;
    private String vehicleType;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
    private String status;
    private Double parkingFee;
    private String transactionId;
    private String paymentStatus;
    private LocalDateTime paymentTime;
    private Long durationMinutes;
    private String formattedDuration;
    private Boolean isActive;
    private Long createdAtTimestamp;
    private Long entryTimeTimestamp;
    private Long exitTimeTimestamp;

    public BookingDetailDto() {}

    public BookingDetailDto(Long id, Long slotId, String slotNumber, Long locationId, String locationName) {
        this.id = id;
        this.slotId = slotId;
        this.slotNumber = slotNumber;
        this.locationId = locationId;
        this.locationName = locationName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSlotId() { return slotId; }
    public void setSlotId(Long slotId) { this.slotId = slotId; }

    public String getSlotNumber() { return slotNumber; }
    public void setSlotNumber(String slotNumber) { this.slotNumber = slotNumber; }

    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public LocalDateTime getEntryTime() { return entryTime; }
    public void setEntryTime(LocalDateTime entryTime) { 
        this.entryTime = entryTime;
        if (entryTime != null) {
            this.entryTimeTimestamp = entryTime.atZone(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli();
        }
    }

    public LocalDateTime getExitTime() { return exitTime; }
    public void setExitTime(LocalDateTime exitTime) { 
        this.exitTime = exitTime;
        if (exitTime != null) {
            this.exitTimeTimestamp = exitTime.atZone(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli();
        }
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getParkingFee() { return parkingFee; }
    public void setParkingFee(Double parkingFee) { this.parkingFee = parkingFee; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public LocalDateTime getPaymentTime() { return paymentTime; }
    public void setPaymentTime(LocalDateTime paymentTime) { this.paymentTime = paymentTime; }

    public Long getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Long durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getFormattedDuration() { return formattedDuration; }
    public void setFormattedDuration(String formattedDuration) { this.formattedDuration = formattedDuration; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Long getCreatedAtTimestamp() { return createdAtTimestamp; }
    public void setCreatedAtTimestamp(Long createdAtTimestamp) { this.createdAtTimestamp = createdAtTimestamp; }

    public Long getEntryTimeTimestamp() { return entryTimeTimestamp; }
    public void setEntryTimeTimestamp(Long entryTimeTimestamp) { this.entryTimeTimestamp = entryTimeTimestamp; }

    public Long getExitTimeTimestamp() { return exitTimeTimestamp; }
    public void setExitTimeTimestamp(Long exitTimeTimestamp) { this.exitTimeTimestamp = exitTimeTimestamp; }
}
