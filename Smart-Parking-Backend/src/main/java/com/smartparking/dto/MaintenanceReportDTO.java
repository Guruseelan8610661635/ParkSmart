package com.smartparking.dto;

import java.time.LocalDateTime;

public class MaintenanceReportDTO {
    private Long slotId;
    private String slotNumber;
    private String locationName;
    private Integer maintenanceCount;
    private Double totalDowntimeHours;
    private Double revenueLostEstimate;
    private LocalDateTime lastMaintenanceDate;
    private Boolean needsAttention;

    // Constructors
    public MaintenanceReportDTO() {}

    public MaintenanceReportDTO(Long slotId, String slotNumber, String locationName, Integer maintenanceCount,
                                Double totalDowntimeHours, Double revenueLostEstimate, LocalDateTime lastMaintenanceDate,
                                Boolean needsAttention) {
        this.slotId = slotId;
        this.slotNumber = slotNumber;
        this.locationName = locationName;
        this.maintenanceCount = maintenanceCount;
        this.totalDowntimeHours = totalDowntimeHours;
        this.revenueLostEstimate = revenueLostEstimate;
        this.lastMaintenanceDate = lastMaintenanceDate;
        this.needsAttention = needsAttention;
    }

    // Getters and Setters
    public Long getSlotId() {
        return slotId;
    }

    public void setSlotId(Long slotId) {
        this.slotId = slotId;
    }

    public String getSlotNumber() {
        return slotNumber;
    }

    public void setSlotNumber(String slotNumber) {
        this.slotNumber = slotNumber;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public Integer getMaintenanceCount() {
        return maintenanceCount;
    }

    public void setMaintenanceCount(Integer maintenanceCount) {
        this.maintenanceCount = maintenanceCount;
    }

    public Double getTotalDowntimeHours() {
        return totalDowntimeHours;
    }

    public void setTotalDowntimeHours(Double totalDowntimeHours) {
        this.totalDowntimeHours = totalDowntimeHours;
    }

    public Double getRevenueLostEstimate() {
        return revenueLostEstimate;
    }

    public void setRevenueLostEstimate(Double revenueLostEstimate) {
        this.revenueLostEstimate = revenueLostEstimate;
    }

    public LocalDateTime getLastMaintenanceDate() {
        return lastMaintenanceDate;
    }

    public void setLastMaintenanceDate(LocalDateTime lastMaintenanceDate) {
        this.lastMaintenanceDate = lastMaintenanceDate;
    }

    public Boolean getNeedsAttention() {
        return needsAttention;
    }

    public void setNeedsAttention(Boolean needsAttention) {
        this.needsAttention = needsAttention;
    }
}
