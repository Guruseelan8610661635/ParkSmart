package com.smartparking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class SlotRequest {

    @NotBlank(message = "Slot number cannot be blank")
    private String slotNumber;

    @NotNull(message = "Location ID cannot be null")
    @Positive(message = "Location ID must be positive")
    private Long locationId;

    private Boolean available = true;  // ✅ Changed from 'boolean' to 'Boolean' to allow null values

    private Boolean isDisabled = false;

    private String maintenanceNotes;

    private String slotType = "CAR";  // CAR, BIKE, TRUCK, EV

    public SlotRequest() {
        System.out.println("🔵 SlotRequest() constructor called - setting available to true");
        this.available = true;
        this.isDisabled = false;
    }

    public SlotRequest(String slotNumber, Long locationId, Boolean available) {
        this.slotNumber = slotNumber;
        this.locationId = locationId;
        this.available = available;
        this.isDisabled = false;
        System.out.println("🔵 SlotRequest(slotNumber, locationId, available) - available=" + available);
    }

    public String getSlotNumber() {
        return slotNumber;
    }

    public void setSlotNumber(String slotNumber) {
        this.slotNumber = slotNumber;
    }

    public Long getLocationId() {
        return locationId;
    }

    public void setLocationId(Long locationId) {
        this.locationId = locationId;
    }

    public Boolean isAvailable() {
        System.out.println("🔵 SlotRequest.isAvailable() returning: " + available);
        return available;
    }

    public void setAvailable(Boolean available) {
        System.out.println("🔵 SlotRequest.setAvailable() called with: " + available);
        this.available = available;
    }

    public Boolean isDisabled() {
        return isDisabled;
    }

    public void setDisabled(Boolean disabled) {
        isDisabled = disabled;
    }

    public String getMaintenanceNotes() {
        return maintenanceNotes;
    }

    public void setMaintenanceNotes(String maintenanceNotes) {
        this.maintenanceNotes = maintenanceNotes;
    }

    public String getSlotType() {
        return slotType;
    }

    public void setSlotType(String slotType) {
        this.slotType = slotType != null ? slotType : "CAR";
    }
}
