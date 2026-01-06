package com.smartparking.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartparking.dto.PricingTierRequest;
import com.smartparking.model.VehiclePricing;
import com.smartparking.repository.VehiclePricingRepository;

@Service
public class AdminVehiclePricingService {

    @Autowired
    private VehiclePricingRepository vehiclePricingRepository;

    public VehiclePricing createPricing(PricingTierRequest request) {
        VehiclePricing pricing = new VehiclePricing();
        pricing.setVehicleType(request.getVehicleType());
        pricing.setHourlyRate(request.getHourlyRate());
        pricing.setDailyRate(request.getDailyRate());
        pricing.setMonthlyRate(request.getMonthlyRate());
        
        return vehiclePricingRepository.save(pricing);
    }

    public VehiclePricing updatePricing(String vehicleType, PricingTierRequest request) {
        VehiclePricing pricing = vehiclePricingRepository.findByVehicleType(vehicleType)
                .orElseThrow(() -> new RuntimeException("Pricing not found for vehicle type: " + vehicleType));
        
        if (request.getHourlyRate() != null) {
            pricing.setHourlyRate(request.getHourlyRate());
        }
        if (request.getDailyRate() != null) {
            pricing.setDailyRate(request.getDailyRate());
        }
        if (request.getMonthlyRate() != null) {
            pricing.setMonthlyRate(request.getMonthlyRate());
        }
        
        return vehiclePricingRepository.save(pricing);
    }

    public void deletePricing(String vehicleType) {
        VehiclePricing pricing = vehiclePricingRepository.findByVehicleType(vehicleType)
                .orElseThrow(() -> new RuntimeException("Pricing not found"));
        vehiclePricingRepository.delete(pricing);
    }

    public List<VehiclePricing> getAllPricings() {
        return vehiclePricingRepository.findAll();
    }

    public VehiclePricing getPricingByVehicleType(String vehicleType) {
        return vehiclePricingRepository.findByVehicleType(vehicleType)
                .orElseThrow(() -> new RuntimeException("Pricing not found"));
    }
}
