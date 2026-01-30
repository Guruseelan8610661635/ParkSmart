package com.smartparking.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.smartparking.dto.SlotRequest;
import com.smartparking.dto.SlotResponse;
import com.smartparking.model.Slot;
import com.smartparking.service.SlotService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/slots")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminSlotController {

    @Autowired
    private SlotService slotService;

    /**
     * Add a new parking slot
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> addSlot(@Valid @RequestBody SlotRequest slotRequest, BindingResult bindingResult) {
        System.out.println("🔴 [POST /admin/slots] Request received");
        System.out.println("🔴 [POST /admin/slots] Slot Number: " + slotRequest.getSlotNumber());
        System.out.println("🔴 [POST /admin/slots] Location ID: " + slotRequest.getLocationId());
        System.out.println("🔴 [POST /admin/slots] Available from request: " + slotRequest.isAvailable());
        
        if (bindingResult.hasErrors()) {
            System.out.println("❌ [POST /admin/slots] Validation errors: " + bindingResult.getAllErrors());
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        }

        try {
            Slot slot = slotService.addSlot(slotRequest);
            System.out.println("🔴 [POST /admin/slots] Slot after creation: available=" + slot.isAvailable());
            SlotResponse response = slotService.convertToResponse(slot);
            System.out.println("🔴 [POST /admin/slots] Response available: " + response.getAvailable());
            System.out.println("✅ [POST /admin/slots] Slot created successfully: " + response.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            System.out.println("⚠️ [POST /admin/slots] IllegalArgumentException: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.out.println("❌ [POST /admin/slots] Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create slot: " + e.getMessage()));
        }
    }

    /**
     * Get all slots
     */
    @GetMapping
    public ResponseEntity<List<SlotResponse>> getAllSlots() {
        List<Slot> slots = slotService.getAllSlots();
        List<SlotResponse> responses = slotService.convertToResponseList(slots);
        System.out.println("🔴 [GET /admin/slots] Returning " + responses.size() + " slots");
        for (SlotResponse response : responses) {
            System.out.println("  - Slot " + response.getId() + ": " + response.getSlotNumber() + " available=" + response.getAvailable() + " isDisabled=" + response.isDisabled());
        }
        return ResponseEntity.ok(responses);
    }

    /**
     * Get slots by location
     */
    @GetMapping("/location/{locationId}")
    public ResponseEntity<?> getSlotsByLocation(@PathVariable Long locationId) {
        try {
            List<Slot> slots = slotService.getSlotsByLocation(locationId);
            List<SlotResponse> responses = slotService.convertToResponseList(slots);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch slots: " + e.getMessage()));
        }
    }

    /**
     * Get available slots by location
     */
    @GetMapping("/location/{locationId}/available")
    public ResponseEntity<?> getAvailableSlotsByLocation(@PathVariable Long locationId) {
        try {
            List<Slot> slots = slotService.getAvailableSlotsByLocation(locationId);
            List<SlotResponse> responses = slotService.convertToResponseList(slots);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch available slots: " + e.getMessage()));
        }
    }

    /**
     * Get slot details by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getSlotById(@PathVariable Long id) {
        try {
            Slot slot = slotService.getSlotById(id);
            SlotResponse response = slotService.convertToResponse(slot);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Update slot details
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSlot(@PathVariable Long id, @Valid @RequestBody SlotRequest slotRequest,
                                       BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        }

        try {
            Slot slot = slotService.updateSlot(id, slotRequest);
            SlotResponse response = slotService.convertToResponse(slot);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update slot: " + e.getMessage()));
        }
    }

    /**
     * Toggle slot availability
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> toggleAvailability(@PathVariable Long id) {
        try {
            Slot slot = slotService.toggleSlotAvailability(id);
            SlotResponse response = slotService.convertToResponse(slot);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to toggle slot availability: " + e.getMessage()));
        }
    }

    /**
     * Disable a slot for maintenance with optional notes
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/disable")
    public ResponseEntity<?> disableSlot(@PathVariable Long id, @RequestBody(required = false) Map<String, String> request) {
        try {
            String maintenanceNotes = (request != null) ? request.get("maintenanceNotes") : null;
            Slot slot = slotService.disableSlot(id, maintenanceNotes);
            SlotResponse response = slotService.convertToResponse(slot);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to disable slot: " + e.getMessage()));
        }
    }

    /**
     * Enable a slot (remove from maintenance mode)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/enable")
    public ResponseEntity<?> enableSlot(@PathVariable Long id) {
        try {
            Slot slot = slotService.enableSlot(id);
            SlotResponse response = slotService.convertToResponse(slot);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to enable slot: " + e.getMessage()));
        }
    }

    /**
     * Update maintenance notes for a slot
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/maintenance-notes")
    public ResponseEntity<?> updateMaintenanceNotes(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String maintenanceNotes = request.get("maintenanceNotes");
            Slot slot = slotService.updateMaintenanceNotes(id, maintenanceNotes);
            SlotResponse response = slotService.convertToResponse(slot);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update maintenance notes: " + e.getMessage()));
        }
    }

    /**
     * Set slot availability status
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/availability")
    public ResponseEntity<?> setAvailability(@PathVariable Long id, @RequestBody Map<String, Boolean> request) {
        try {
            Boolean available = request.get("available");
            if (available == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Availability status is required"));
            }

            Slot slot = slotService.setSlotAvailability(id, available);
            SlotResponse response = slotService.convertToResponse(slot);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to set slot availability: " + e.getMessage()));
        }
    }

    /**
     * Delete a slot
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSlot(@PathVariable Long id) {
        try {
            slotService.deleteSlot(id);
            return ResponseEntity.ok(Map.of("message", "Slot deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete slot: " + e.getMessage()));
        }
    }

    /**
     * Get slot statistics for a location
     */
    @GetMapping("/location/{locationId}/stats")
    public ResponseEntity<?> getLocationStats(@PathVariable Long locationId) {
        try {
            long totalSlots = slotService.getSlotCountByLocation(locationId);
            long availableSlots = slotService.getAvailableSlotCountByLocation(locationId);
            long disabledSlots = slotService.getDisabledSlotCountByLocation(locationId);
            long bookedSlots = totalSlots - availableSlots - disabledSlots;

            Map<String, Object> stats = Map.of(
                    "locationId", locationId,
                    "totalSlots", totalSlots,
                    "availableSlots", availableSlots,
                    "disabledSlots", disabledSlots,
                    "bookedSlots", bookedSlots,
                    "occupancyRate", totalSlots > 0 ? Math.round((double) bookedSlots / (totalSlots - disabledSlots) * 100) : 0
            );

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch statistics: " + e.getMessage()));
        }
    }

    /**
     * Bulk add multiple slots for a location
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/bulk/location/{locationId}")
    public ResponseEntity<?> addMultipleSlots(@PathVariable Long locationId, @RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<String> slotNumbers = (List<String>) request.get("slotNumbers");

            if (slotNumbers == null || slotNumbers.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Slot numbers list cannot be empty"));
            }

            List<Slot> addedSlots = slotNumbers.stream()
                    .map(slotNumber -> {
                        SlotRequest slotRequest = new SlotRequest(slotNumber, locationId, true);
                        return slotService.addSlot(slotRequest);
                    })
                    .toList();

            List<SlotResponse> responses = slotService.convertToResponseList(addedSlots);
            return ResponseEntity.status(HttpStatus.CREATED).body(responses);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create slots: " + e.getMessage()));
        }
    }
}
