package com.smartparking.service;

import com.smartparking.model.VehicleType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.time.LocalDateTime;

/**
 * Fee Calculation Service
 * Calculates parking fees based on duration and vehicle type with tiered/dynamic rates.
 * Supports prorated billing (per-minute calculations).
 */
@Service
public class FeeCalculationService {

    @Autowired
    private VehiclePricingService vehiclePricingService;

    // Default rate: 20 Rs per hour (for backward compatibility)
    private static final double DEFAULT_RATE_PER_HOUR = 20.0;

    /**
     * Calculate parking fee based on entry/exit times and vehicle type
     * Uses pro-rata (prorated) billing: fee = (duration in minutes / 60) * rate for vehicle type
     *
     * @param entryTime When vehicle entered the parking slot
     * @param exitTime When vehicle exited the parking slot
     * @param vehicleType Type of vehicle (BIKE, CAR, SUV, TRUCK)
     * @return Calculated fee in rupees (rounded to 2 decimals)
     */
    public double calculateFee(LocalDateTime entryTime, LocalDateTime exitTime, VehicleType vehicleType) {
        if (entryTime == null || exitTime == null || exitTime.isBefore(entryTime)) {
            return 0.0;
        }

        // Calculate duration in minutes
        long durationMinutes = Duration.between(entryTime, exitTime).toMinutes();

        // Ensure minimum parking duration of 1 minute
        durationMinutes = Math.max(durationMinutes, 1);

        // Get rate for specific vehicle type
        double ratePerHour = vehiclePricingService.getRatePerHour(vehicleType);

        // Pro-rata fee calculation: (minutes / 60) * rate per hour
        double fee = (durationMinutes / 60.0) * ratePerHour;

        // Round to 2 decimal places
        return Math.round(fee * 100.0) / 100.0;
    }

    /**
     * Calculate fee based on entry/exit times and vehicle type string
     *
     * @param entryTime Entry time
     * @param exitTime Exit time
     * @param vehicleTypeString Vehicle type as string
     * @return Calculated fee
     */
    public double calculateFee(LocalDateTime entryTime, LocalDateTime exitTime, String vehicleTypeString) {
        VehicleType vehicleType = VehicleType.fromString(vehicleTypeString);
        return calculateFee(entryTime, exitTime, vehicleType);
    }

    /**
     * Calculate fee with default vehicle type (CAR) - for backward compatibility
     *
     * @param entryTime Entry time
     * @param exitTime Exit time
     * @return Calculated fee using CAR rate
     */
    public double calculateFee(LocalDateTime entryTime, LocalDateTime exitTime) {
        return calculateFee(entryTime, exitTime, VehicleType.CAR);
    }

    /**
     * Calculate fee with custom rate (for special cases or testing)
     *
     * @param entryTime Entry time
     * @param exitTime Exit time
     * @param ratePerHour Custom rate per hour
     * @return Calculated fee
     */
    public double calculateFeeWithCustomRate(LocalDateTime entryTime, LocalDateTime exitTime, double ratePerHour) {
        if (entryTime == null || exitTime == null || exitTime.isBefore(entryTime)) {
            return 0.0;
        }

        long durationMinutes = Duration.between(entryTime, exitTime).toMinutes();
        durationMinutes = Math.max(durationMinutes, 1);

        double fee = (durationMinutes / 60.0) * ratePerHour;
        return Math.round(fee * 100.0) / 100.0;
    }

    /**
     * Calculate parking duration in minutes
     *
     * @param entryTime Entry time
     * @param exitTime Exit time
     * @return Duration in minutes
     */
    public long calculateDurationMinutes(LocalDateTime entryTime, LocalDateTime exitTime) {
        if (entryTime == null || exitTime == null) {
            return 0;
        }
        return Duration.between(entryTime, exitTime).toMinutes();
    }

    /**
     * Calculate parking duration in hours (decimal)
     *
     * @param entryTime Entry time
     * @param exitTime Exit time
     * @return Duration in hours (e.g., 1.5 for 1 hour 30 minutes)
     */
    public double calculateDurationHours(LocalDateTime entryTime, LocalDateTime exitTime) {
        long minutes = calculateDurationMinutes(entryTime, exitTime);
        return minutes / 60.0;
    }

    /**
     * Get rate per hour for specific vehicle type
     */
    public double getRatePerHour(VehicleType vehicleType) {
        return vehiclePricingService.getRatePerHour(vehicleType);
    }

    /**
     * Get rate per hour for specific vehicle type (string)
     */
    public double getRatePerHour(String vehicleTypeString) {
        return vehiclePricingService.getRatePerHour(vehicleTypeString);
    }

    /**
     * Get default rate per hour (CAR type)
     */
    public double getRatePerHour() {
        return vehiclePricingService.getDefaultRate();
    }
}
