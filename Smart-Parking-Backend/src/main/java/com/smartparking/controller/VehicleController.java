package com.smartparking.controller;

import com.smartparking.model.Vehicle;
import com.smartparking.repository.UserRepository;
import com.smartparking.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:5173")
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepo;

    @Autowired
    private UserRepository userRepo;

    /**
     * Get all vehicles for authenticated user
     * GET /api/vehicles/my
     */
    @GetMapping("/my")
    public ResponseEntity<?> getMyVehicles(Authentication authentication) {
        try {
            String email = authentication.getName();
            Long userId = userRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"))
                    .getId();

            List<Vehicle> vehicles = vehicleRepo.findByUserId(userId);
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Add new vehicle
     * POST /api/vehicles
     */
    @PostMapping
    public ResponseEntity<?> addVehicle(
            @RequestBody Vehicle vehicle,
            Authentication authentication) {
        try {
            System.out.println("🔵 ========================================");
            System.out.println("🔵 POST /api/vehicles endpoint called");
            System.out.println("🔵 ========================================");
            
            // Check authentication
            if (authentication == null) {
                System.out.println("❌ ERROR: Authentication is NULL");
                return ResponseEntity.status(401)
                    .body(Map.of("error", "Not authenticated", "message", "Authentication object is null"));
            }
            
            System.out.println("✅ Authentication object: " + authentication);
            System.out.println("✅ Authentication principal: " + authentication.getPrincipal());
            
            String email = authentication.getName();
            System.out.println("📧 Email from token: " + email);
            
            Long userId = userRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"))
                    .getId();

            vehicle.setUserId(userId);

            // If this is the first vehicle, make it default
            List<Vehicle> existingVehicles = vehicleRepo.findByUserId(userId);
            if (existingVehicles.isEmpty()) {
                vehicle.setIsDefault(true);
            }

            Vehicle saved = vehicleRepo.save(vehicle);
            System.out.println("✅ Vehicle saved successfully: " + saved.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            System.out.println("❌ Error in addVehicle: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Update vehicle
     * PUT /api/vehicles/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVehicle(
            @PathVariable Long id,
            @RequestBody Vehicle vehicleDetails,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            Long userId = userRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"))
                    .getId();

            Vehicle vehicle = vehicleRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Vehicle not found"));

            // Verify ownership
            if (!vehicle.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Unauthorized"));
            }

            if (vehicleDetails.getVehicleType() != null) {
                vehicle.setVehicleType(vehicleDetails.getVehicleType());
            }
            if (vehicleDetails.getRegistrationNumber() != null) {
                vehicle.setRegistrationNumber(vehicleDetails.getRegistrationNumber());
            }
            if (vehicleDetails.getMake() != null) {
                vehicle.setMake(vehicleDetails.getMake());
            }
            if (vehicleDetails.getModel() != null) {
                vehicle.setModel(vehicleDetails.getModel());
            }
            if (vehicleDetails.getColor() != null) {
                vehicle.setColor(vehicleDetails.getColor());
            }

            Vehicle updated = vehicleRepo.save(vehicle);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Delete vehicle
     * DELETE /api/vehicles/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicle(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            Long userId = userRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"))
                    .getId();

            Vehicle vehicle = vehicleRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Vehicle not found"));

            // Verify ownership
            if (!vehicle.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Unauthorized"));
            }

            vehicleRepo.delete(vehicle);
            return ResponseEntity.ok(Map.of("message", "Vehicle deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Set default vehicle
     * PUT /api/vehicles/{id}/set-default
     */
    @PutMapping("/{id}/set-default")
    public ResponseEntity<?> setDefaultVehicle(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            Long userId = userRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"))
                    .getId();

            Vehicle vehicle = vehicleRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Vehicle not found"));

            // Verify ownership
            if (!vehicle.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Unauthorized"));
            }

            // Unset all other vehicles as default
            List<Vehicle> allVehicles = vehicleRepo.findByUserId(userId);
            for (Vehicle v : allVehicles) {
                v.setIsDefault(false);
                vehicleRepo.save(v);
            }

            // Set this vehicle as default
            vehicle.setIsDefault(true);
            Vehicle updated = vehicleRepo.save(vehicle);

            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
