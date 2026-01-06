package com.smartparking.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.smartparking.model.VehiclePricing;

public interface VehiclePricingRepository extends JpaRepository<VehiclePricing, Long> {
    Optional<VehiclePricing> findByVehicleType(String vehicleType);
}
