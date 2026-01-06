package com.smartparking.controller;

import com.smartparking.model.VehicleType;
import com.smartparking.service.VehiclePricingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Vehicle Pricing Controller
 * Manages pricing rates for different vehicle types
 */
@RestController
@RequestMapping("/api/pricing")
@CrossOrigin(origins = "*")
public class VehiclePricingController {

    @Autowired
    private VehiclePricingService pricingService;

    /**
     * Get all pricing rates for all vehicle types
     * GET /api/pricing/rates
     */
    @GetMapping("/rates")
    public ResponseEntity<Map<String, Object>> getAllRates() {
        Map<VehicleType, Double> rates = pricingService.getAllRates();
        
        Map<String, Object> response = new HashMap<>();
        Map<String, Double> ratesMap = new HashMap<>();
        
        for (Map.Entry<VehicleType, Double> entry : rates.entrySet()) {
            ratesMap.put(entry.getKey().name(), entry.getValue());
        }
        
        response.put("rates", ratesMap);
        response.put("currency", "INR");
        response.put("unit", "per hour");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get rate for specific vehicle type
     * GET /api/pricing/rates/{vehicleType}
     */
    @GetMapping("/rates/{vehicleType}")
    public ResponseEntity<Map<String, Object>> getRateForVehicleType(@PathVariable String vehicleType) {
        try {
            VehicleType vType = VehicleType.fromString(vehicleType);
            double rate = pricingService.getRatePerHour(vType);
            
            Map<String, Object> response = new HashMap<>();
            response.put("vehicleType", vType.name());
            response.put("displayName", vType.getDisplayName());
            response.put("ratePerHour", rate);
            response.put("currency", "INR");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid vehicle type"));
        }
    }

    /**
     * Update rate for specific vehicle type
     * PUT /api/pricing/rates/{vehicleType}
     * 
     * Request Body: { "rate": 25.0 }
     */
    @PutMapping("/rates/{vehicleType}")
    public ResponseEntity<Map<String, Object>> updateRateForVehicleType(
            @PathVariable String vehicleType,
            @RequestBody Map<String, Double> request
    ) {
        try {
            VehicleType vType = VehicleType.fromString(vehicleType);
            Double newRate = request.get("rate");
            
            if (newRate == null || newRate <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid rate value"));
            }
            
            pricingService.updateRate(vType, newRate);
            
            Map<String, Object> response = new HashMap<>();
            response.put("vehicleType", vType.name());
            response.put("displayName", vType.getDisplayName());
            response.put("newRate", newRate);
            response.put("currency", "INR");
            response.put("message", "Rate updated successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get all vehicle types with details
     * GET /api/pricing/vehicle-types
     */
    @GetMapping("/vehicle-types")
    public ResponseEntity<Map<String, Object>> getVehicleTypes() {
        Map<String, Object> response = new HashMap<>();
        Map<String, Map<String, Object>> vehicleTypes = new HashMap<>();
        
        for (VehicleType vType : VehicleType.values()) {
            Map<String, Object> details = new HashMap<>();
            details.put("name", vType.name());
            details.put("displayName", vType.getDisplayName());
            details.put("description", vType.getDescription());
            details.put("ratePerHour", pricingService.getRatePerHour(vType));
            
            vehicleTypes.put(vType.name(), details);
        }
        
        response.put("vehicleTypes", vehicleTypes);
        response.put("currency", "INR");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Calculate fee for specific vehicle type and duration
     * POST /api/pricing/calculate
     * 
     * Request Body: { "vehicleType": "CAR", "durationMinutes": 90 }
     */
    @PostMapping("/calculate")
    public ResponseEntity<Map<String, Object>> calculateFee(@RequestBody Map<String, Object> request) {
        try {
            String vehicleTypeStr = (String) request.get("vehicleType");
            Integer durationMinutes = (Integer) request.get("durationMinutes");
            
            if (vehicleTypeStr == null || durationMinutes == null || durationMinutes <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid request parameters"));
            }
            
            VehicleType vehicleType = VehicleType.fromString(vehicleTypeStr);
            double ratePerHour = pricingService.getRatePerHour(vehicleType);
            double fee = (durationMinutes / 60.0) * ratePerHour;
            fee = Math.round(fee * 100.0) / 100.0;
            
            Map<String, Object> response = new HashMap<>();
            response.put("vehicleType", vehicleType.name());
            response.put("durationMinutes", durationMinutes);
            response.put("durationHours", durationMinutes / 60.0);
            response.put("ratePerHour", ratePerHour);
            response.put("calculatedFee", fee);
            response.put("currency", "INR");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
