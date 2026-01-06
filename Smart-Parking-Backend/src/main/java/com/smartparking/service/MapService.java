package com.smartparking.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartparking.dto.LocationMapDto;
import com.smartparking.dto.SlotMapLayoutDto;
import com.smartparking.model.Location;
import com.smartparking.model.Slot;
import com.smartparking.repository.LocationRepository;
import com.smartparking.repository.SlotRepository;

@Service
public class MapService {

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private SlotRepository slotRepository;

    /**
     * Get all locations with map data for display
     */
    public List<LocationMapDto> getAllLocationsForMap() {
        List<Location> locations = locationRepository.findAll();
        
        return locations.stream()
                .map(this::convertToMapDto)
                .collect(Collectors.toList());
    }

    /**
     * Get active locations only (for public map display)
     */
    public List<LocationMapDto> getActiveLocationsForMap() {
        List<Location> locations = locationRepository.findAll();
        
        return locations.stream()
                .filter(loc -> loc.getIsActive() != null && loc.getIsActive())
                .map(this::convertToMapDto)
                .collect(Collectors.toList());
    }

    /**
     * Get locations within a radius from user's current position
     */
    public List<LocationMapDto> getLocationsNearby(Double userLat, Double userLon, Double radiusKm) {
        List<Location> locations = locationRepository.findAll();
        
        return locations.stream()
                .filter(loc -> loc.getIsActive() != null && loc.getIsActive())
                .filter(loc -> loc.getLatitude() != null && loc.getLongitude() != null)
                .map(loc -> {
                    LocationMapDto dto = convertToMapDto(loc);
                    double distance = calculateDistance(userLat, userLon, 
                                                        loc.getLatitude(), loc.getLongitude());
                    dto.setDistance(distance);
                    return dto;
                })
                .filter(dto -> dto.getDistance() <= radiusKm)
                .sorted((a, b) -> Double.compare(a.getDistance(), b.getDistance()))
                .collect(Collectors.toList());
    }

    /**
     * Get location details by ID with real-time slot data
     */
    public LocationMapDto getLocationMapDetails(Long locationId) {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new RuntimeException("Location not found"));
        
        LocationMapDto dto = convertToMapDto(location);
        updateRealTimeSlotData(dto, locationId);
        
        return dto;
    }

    /**
     * Get slot layout for a specific location
     */
    public List<SlotMapLayoutDto> getSlotLayoutByLocation(Long locationId) {
        List<Slot> slots = slotRepository.findByLocationId(locationId);
        
        return slots.stream()
                .map(this::convertToSlotMapLayoutDto)
                .collect(Collectors.toList());
    }

    /**
     * Update location slot counts in real-time
     */
    public void updateLocationSlotCounts(Long locationId) {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new RuntimeException("Location not found"));
        
        List<Slot> slots = slotRepository.findByLocationId(locationId);
        
        int totalSlots = slots.size();
        long availableSlots = slots.stream().filter(s -> s.isAvailable() && !s.isDisabled()).count();
        
        location.setTotalSlots(totalSlots);
        location.setAvailableSlots((int) availableSlots);
        
        locationRepository.save(location);
    }

    /**
     * Convert Location to LocationMapDto
     */
    private LocationMapDto convertToMapDto(Location location) {
        LocationMapDto dto = new LocationMapDto();
        dto.setId(location.getId());
        dto.setName(location.getName());
        dto.setLatitude(location.getLatitude());
        dto.setLongitude(location.getLongitude());
        dto.setAddress(location.getAddress());
        dto.setDescription(location.getDescription());
        dto.setAmenities(location.getAmenities());
        dto.setOperatingHours(location.getOperatingHours());
        dto.setIsActive(location.getIsActive());
        dto.setMarkerColor(location.getMarkerColor());
        
        // ✅ FIX: Calculate real-time slot data from database instead of stored values
        updateRealTimeSlotData(dto, location.getId());
        
        return dto;
    }

    /**
     * Update real-time slot data from database
     */
    private void updateRealTimeSlotData(LocationMapDto dto, Long locationId) {
        List<Slot> slots = slotRepository.findByLocationId(locationId);
        
        int totalSlots = slots.size();
        long availableSlots = slots.stream().filter(s -> s.isAvailable() && !s.isDisabled()).count();
        long disabledSlots = slots.stream().filter(Slot::isDisabled).count();
        
        dto.setTotalSlots(totalSlots);
        dto.setAvailableSlots((int) availableSlots);
        dto.setDisabledSlots((int) disabledSlots);
        dto.calculateOccupancy();
    }

    /**
     * Convert Slot to SlotMapLayoutDto
     */
    private SlotMapLayoutDto convertToSlotMapLayoutDto(Slot slot) {
        SlotMapLayoutDto dto = new SlotMapLayoutDto();
        dto.setId(slot.getId());
        dto.setSlotNumber(slot.getSlotNumber());
        dto.setAvailable(slot.isAvailable());
        
        // Parse slot number for zone/floor info (e.g., "A1-G" = Zone A, Slot 1, Ground floor)
        parseSlotNumberForLayout(slot.getSlotNumber(), dto);
        
        return dto;
    }

    /**
     * Parse slot number to extract zone and position information
     */
    private void parseSlotNumberForLayout(String slotNumber, SlotMapLayoutDto dto) {
        if (slotNumber == null || slotNumber.isEmpty()) {
            return;
        }
        
        // Extract zone (first letter)
        if (slotNumber.length() > 0 && Character.isLetter(slotNumber.charAt(0))) {
            dto.setZone(String.valueOf(slotNumber.charAt(0)));
        }
        
        // Extract number for positioning
        String numPart = slotNumber.replaceAll("[^0-9]", "");
        if (!numPart.isEmpty()) {
            int num = Integer.parseInt(numPart);
            
            // Calculate grid position (example: 10 slots per row)
            int slotsPerRow = 10;
            dto.setPositionX(num % slotsPerRow);
            dto.setPositionY(num / slotsPerRow);
        }
        
        // Default rotation
        dto.setRotation(0);
        
        // Default floor
        dto.setFloor("Ground");
    }

    /**
     * Calculate distance between two coordinates using Haversine formula
     * Returns distance in kilometers
     */
    private double calculateDistance(Double lat1, Double lon1, Double lat2, Double lon2) {
        final int R = 6371; // Radius of the earth in km

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c; // Distance in km
    }

    /**
     * Get marker color based on occupancy
     */
    public String getMarkerColorByOccupancy(Double occupancyPercentage) {
        if (occupancyPercentage == null) return "gray";
        if (occupancyPercentage < 30) return "green";   // Low occupancy
        if (occupancyPercentage < 70) return "orange";  // Medium occupancy
        return "red"; // High occupancy
    }
}
