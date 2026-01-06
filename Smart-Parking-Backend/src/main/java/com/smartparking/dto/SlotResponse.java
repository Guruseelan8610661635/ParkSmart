package com.smartparking.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SlotResponse {

    private Long id;
    private String slotNumber;
    private boolean available;
    @JsonProperty("isDisabled")
    private boolean isDisabled;
    private String maintenanceNotes;
    private Long locationId;
    private String locationName;
    private String slotType;

    public SlotResponse() {
    }

    public SlotResponse(Long id, String slotNumber, boolean available, Long locationId, String locationName) {
        this.id = id;
        this.slotNumber = slotNumber;
        this.available = available;
        this.isDisabled = false;
        this.maintenanceNotes = null;
        this.locationId = locationId;
        this.locationName = locationName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSlotNumber() {
        return slotNumber;
    }

    public void setSlotNumber(String slotNumber) {
        this.slotNumber = slotNumber;
    }

    public boolean getAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public boolean isDisabled() {
        return isDisabled;
    }

    public void setDisabled(boolean disabled) {
        isDisabled = disabled;
    }

    public String getMaintenanceNotes() {
        return maintenanceNotes;
    }

    public void setMaintenanceNotes(String maintenanceNotes) {
        this.maintenanceNotes = maintenanceNotes;
    }

    public Long getLocationId() {
        return locationId;
    }

    public void setLocationId(Long locationId) {
        this.locationId = locationId;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getSlotType() {
        return slotType;
    }

    public void setSlotType(String slotType) {
        this.slotType = slotType;
    }
}
