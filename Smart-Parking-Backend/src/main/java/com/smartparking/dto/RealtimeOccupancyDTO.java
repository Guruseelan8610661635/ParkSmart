package com.smartparking.dto;

public class RealtimeOccupancyDTO {
    private Long locationId;
    private String locationName;
    private Integer totalSlots;
    private Integer occupiedSlots;
    private Integer availableSlots;
    private Integer reservedSlots;
    private Integer maintenanceSlots;
    private Double occupancyPercentage;
    private java.util.List<SlotStatusDTO> slots;

    public static class SlotStatusDTO {
        private Long slotId;
        private String slotNumber;
        private String slotType;
        private String status; // AVAILABLE, OCCUPIED, RESERVED, UNDER_MAINTENANCE

        public SlotStatusDTO() {}

        public SlotStatusDTO(Long slotId, String slotNumber, String slotType, String status) {
            this.slotId = slotId;
            this.slotNumber = slotNumber;
            this.slotType = slotType;
            this.status = status;
        }

        public Long getSlotId() { return slotId; }
        public void setSlotId(Long slotId) { this.slotId = slotId; }

        public String getSlotNumber() { return slotNumber; }
        public void setSlotNumber(String slotNumber) { this.slotNumber = slotNumber; }

        public String getSlotType() { return slotType; }
        public void setSlotType(String slotType) { this.slotType = slotType; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public RealtimeOccupancyDTO() {}

    public RealtimeOccupancyDTO(Long locationId, String locationName, Integer totalSlots,
                                 Integer occupiedSlots, Integer availableSlots,
                                 Integer reservedSlots, Integer maintenanceSlots,
                                 Double occupancyPercentage) {
        this.locationId = locationId;
        this.locationName = locationName;
        this.totalSlots = totalSlots;
        this.occupiedSlots = occupiedSlots;
        this.availableSlots = availableSlots;
        this.reservedSlots = reservedSlots;
        this.maintenanceSlots = maintenanceSlots;
        this.occupancyPercentage = occupancyPercentage;
        this.slots = new java.util.ArrayList<>();
    }

    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public Integer getTotalSlots() { return totalSlots; }
    public void setTotalSlots(Integer totalSlots) { this.totalSlots = totalSlots; }

    public Integer getOccupiedSlots() { return occupiedSlots; }
    public void setOccupiedSlots(Integer occupiedSlots) { this.occupiedSlots = occupiedSlots; }

    public Integer getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(Integer availableSlots) { this.availableSlots = availableSlots; }

    public Integer getReservedSlots() { return reservedSlots; }
    public void setReservedSlots(Integer reservedSlots) { this.reservedSlots = reservedSlots; }

    public Integer getMaintenanceSlots() { return maintenanceSlots; }
    public void setMaintenanceSlots(Integer maintenanceSlots) { this.maintenanceSlots = maintenanceSlots; }

    public Double getOccupancyPercentage() { return occupancyPercentage; }
    public void setOccupancyPercentage(Double occupancyPercentage) { this.occupancyPercentage = occupancyPercentage; }

    public java.util.List<SlotStatusDTO> getSlots() { return slots; }
    public void setSlots(java.util.List<SlotStatusDTO> slots) { this.slots = slots; }
}
