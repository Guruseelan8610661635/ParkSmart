package com.smartparking.dto;

public class LocationMapDto {
    private Long id;
    private String name;
    private Double latitude;
    private Double longitude;
    private String address;
    private String description;
    private Integer totalSlots;
    private Integer availableSlots;
    private Integer occupiedSlots;
    private Integer disabledSlots;
    private Double occupancyPercentage;
    private String amenities;
    private String operatingHours;
    private Boolean isActive;
    private String markerColor;
    private Double distance; // Distance from user's location (in km)

    public LocationMapDto() {}

    public LocationMapDto(Long id, String name, Double latitude, Double longitude) {
        this.id = id;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Calculate occupancy percentage
    public void calculateOccupancy() {
        if (totalSlots != null && totalSlots > 0) {
            if (disabledSlots == null) disabledSlots = 0;
            if (availableSlots == null) availableSlots = 0;
            
            // Occupied = Total - Available - Disabled
            this.occupiedSlots = totalSlots - (availableSlots + disabledSlots);
            
            // Occupancy percentage is based on non-disabled slots only
            int activeSlots = totalSlots - disabledSlots;
            this.occupancyPercentage = activeSlots > 0 ? ((double) occupiedSlots / activeSlots) * 100 : 0;
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getTotalSlots() { return totalSlots; }
    public void setTotalSlots(Integer totalSlots) { this.totalSlots = totalSlots; }

    public Integer getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(Integer availableSlots) { this.availableSlots = availableSlots; }

    public Integer getOccupiedSlots() { return occupiedSlots; }
    public void setOccupiedSlots(Integer occupiedSlots) { this.occupiedSlots = occupiedSlots; }

    public Integer getDisabledSlots() { return disabledSlots; }
    public void setDisabledSlots(Integer disabledSlots) { this.disabledSlots = disabledSlots; }

    public Double getOccupancyPercentage() { return occupancyPercentage; }
    public void setOccupancyPercentage(Double occupancyPercentage) { this.occupancyPercentage = occupancyPercentage; }

    public String getAmenities() { return amenities; }
    public void setAmenities(String amenities) { this.amenities = amenities; }

    public String getOperatingHours() { return operatingHours; }
    public void setOperatingHours(String operatingHours) { this.operatingHours = operatingHours; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getMarkerColor() { return markerColor; }
    public void setMarkerColor(String markerColor) { this.markerColor = markerColor; }

    public Double getDistance() { return distance; }
    public void setDistance(Double distance) { this.distance = distance; }
}
