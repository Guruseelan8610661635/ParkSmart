package com.smartparking.dto;

import java.time.LocalDateTime;

public class SlotUtilizationDTO {
    private Long slotId;
    private String slotNumber;
    private String locationName;
    private Integer totalBookings;
    private Double idleTimeHours;
    private Double turnoverRate;
    private LocalDateTime lastBookedDate;
    private Double utilizationPercentage;
    private Double revenueGenerated;

    public SlotUtilizationDTO() {}

    public SlotUtilizationDTO(Long slotId, String slotNumber, String locationName,
                              Integer totalBookings, Double idleTimeHours, Double turnoverRate,
                              LocalDateTime lastBookedDate, Double utilizationPercentage, Double revenueGenerated) {
        this.slotId = slotId;
        this.slotNumber = slotNumber;
        this.locationName = locationName;
        this.totalBookings = totalBookings;
        this.idleTimeHours = idleTimeHours;
        this.turnoverRate = turnoverRate;
        this.lastBookedDate = lastBookedDate;
        this.utilizationPercentage = utilizationPercentage;
        this.revenueGenerated = revenueGenerated;
    }

    public Long getSlotId() { return slotId; }
    public void setSlotId(Long slotId) { this.slotId = slotId; }
    public String getSlotNumber() { return slotNumber; }
    public void setSlotNumber(String slotNumber) { this.slotNumber = slotNumber; }
    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }
    public Integer getTotalBookings() { return totalBookings; }
    public void setTotalBookings(Integer totalBookings) { this.totalBookings = totalBookings; }
    public Double getIdleTimeHours() { return idleTimeHours; }
    public void setIdleTimeHours(Double idleTimeHours) { this.idleTimeHours = idleTimeHours; }
    public Double getTurnoverRate() { return turnoverRate; }
    public void setTurnoverRate(Double turnoverRate) { this.turnoverRate = turnoverRate; }
    public LocalDateTime getLastBookedDate() { return lastBookedDate; }
    public void setLastBookedDate(LocalDateTime lastBookedDate) { this.lastBookedDate = lastBookedDate; }
    public Double getUtilizationPercentage() { return utilizationPercentage; }
    public void setUtilizationPercentage(Double utilizationPercentage) { this.utilizationPercentage = utilizationPercentage; }
    public Double getRevenueGenerated() { return revenueGenerated; }
    public void setRevenueGenerated(Double revenueGenerated) { this.revenueGenerated = revenueGenerated; }
}
