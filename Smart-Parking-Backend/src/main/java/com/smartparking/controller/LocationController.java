package com.smartparking.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.smartparking.model.Location;
import com.smartparking.repository.LocationRepository;
import com.smartparking.service.MapService;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin
public class LocationController {

    private final LocationRepository locationRepo;
    private final MapService mapService;

    public LocationController(LocationRepository locationRepo, MapService mapService) {
        this.locationRepo = locationRepo;
        this.mapService = mapService;
    }

    /**
     * GET /api/locations
     * Get all locations
     */
    @GetMapping
    public List<Location> getLocations() {
        return locationRepo.findAll();
    }

    /**
     * GET /api/locations/{id}
     * Get location by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getLocationById(@PathVariable Long id) {
        try {
            Location location = locationRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Location not found"));
            return ResponseEntity.ok(location);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/locations
     * Create new location with map data (Admin only)
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createLocation(@RequestBody Location location) {
        try {
            Location saved = locationRepo.save(location);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * PUT /api/locations/{id}
     * Update location (Admin only)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateLocation(@PathVariable Long id, @RequestBody Location locationDetails) {
        try {
            Location location = locationRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Location not found"));
            
            // Update fields
            location.setName(locationDetails.getName());
            location.setLatitude(locationDetails.getLatitude());
            location.setLongitude(locationDetails.getLongitude());
            location.setAddress(locationDetails.getAddress());
            location.setDescription(locationDetails.getDescription());
            location.setAmenities(locationDetails.getAmenities());
            location.setOperatingHours(locationDetails.getOperatingHours());
            location.setIsActive(locationDetails.getIsActive());
            location.setMarkerColor(locationDetails.getMarkerColor());
            
            // Refresh slot counts
            mapService.updateLocationSlotCounts(id);
            
            Location updated = locationRepo.save(location);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * DELETE /api/locations/{id}
     * Delete location (Admin only)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteLocation(@PathVariable Long id) {
        try {
            locationRepo.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Location deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
