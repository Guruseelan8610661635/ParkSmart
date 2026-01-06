package com.smartparking.dto;

public class SlotMapLayoutDto {
    private Long id;
    private String slotNumber;
    private Boolean available;
    private String slotType; // CAR, BIKE, SUV, TRUCK
    private Integer positionX; // X coordinate on map grid
    private Integer positionY; // Y coordinate on map grid
    private Integer rotation; // Rotation angle (0, 90, 180, 270)
    private String zone; // A, B, C, etc.
    private String floor; // Ground, 1st, 2nd, etc.

    public SlotMapLayoutDto() {}

    public SlotMapLayoutDto(Long id, String slotNumber, Boolean available) {
        this.id = id;
        this.slotNumber = slotNumber;
        this.available = available;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSlotNumber() { return slotNumber; }
    public void setSlotNumber(String slotNumber) { this.slotNumber = slotNumber; }

    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }

    public String getSlotType() { return slotType; }
    public void setSlotType(String slotType) { this.slotType = slotType; }

    public Integer getPositionX() { return positionX; }
    public void setPositionX(Integer positionX) { this.positionX = positionX; }

    public Integer getPositionY() { return positionY; }
    public void setPositionY(Integer positionY) { this.positionY = positionY; }

    public Integer getRotation() { return rotation; }
    public void setRotation(Integer rotation) { this.rotation = rotation; }

    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }

    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }
}
