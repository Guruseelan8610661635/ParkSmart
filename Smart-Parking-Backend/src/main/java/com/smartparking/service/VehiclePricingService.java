package com.smartparking.service;

import com.smartparking.model.VehicleType;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Vehicle Pricing Configuration Service
 * Manages pricing rates for different vehicle types
 */
@Service
public class VehiclePricingService {

    // Pricing rates per hour for each vehicle type (in Rupees)
    private final Map<VehicleType, Double> ratesPerHour;

    public VehiclePricingService() {
        ratesPerHour = new HashMap<>();
        
        // Default pricing (you can modify these rates as needed)
        // Uniform INR pricing across all vehicle types
        ratesPerHour.put(VehicleType.BIKE, 20.0);
        ratesPerHour.put(VehicleType.CAR, 20.0);
        ratesPerHour.put(VehicleType.SUV, 20.0);
        ratesPerHour.put(VehicleType.TRUCK, 20.0);
    }

    /**
     * Get hourly rate for a specific vehicle type
     */
    public double getRatePerHour(VehicleType vehicleType) {
        return ratesPerHour.getOrDefault(vehicleType, ratesPerHour.get(VehicleType.CAR));
    }

    /**
     * Get hourly rate from string vehicle type
     */
    public double getRatePerHour(String vehicleTypeString) {
        VehicleType vehicleType = VehicleType.fromString(vehicleTypeString);
        return getRatePerHour(vehicleType);
    }

    /**
     * Update rate for a specific vehicle type
     */
    public void updateRate(VehicleType vehicleType, double newRate) {
        if (newRate > 0) {
            ratesPerHour.put(vehicleType, newRate);
        }
    }

    /**
     * Get all pricing rates
     */
    public Map<VehicleType, Double> getAllRates() {
        return new HashMap<>(ratesPerHour);
    }

    /**
     * Get default rate (for CAR type)
     */
    public double getDefaultRate() {
        return ratesPerHour.get(VehicleType.CAR);
    }
}
