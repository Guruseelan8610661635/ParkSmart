package com.smartparking.dto;

public class SlotWithLocationDto {
    private Long id;
    private String slotNumber;
    private Boolean available;
    private Long locationId;
    private String locationName;

    public SlotWithLocationDto() {}

    public SlotWithLocationDto(Long id, String slotNumber, Boolean available, 
                                Long locationId, String locationName) {
        this.id = id;
        this.slotNumber = slotNumber;
        this.available = available;
        this.locationId = locationId;
        this.locationName = locationName;
    }

    // Getters and Setters
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

    public Boolean getAvailable() { 
        return available; 
    }
    
    public void setAvailable(Boolean available) { 
        this.available = available; 
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
}
