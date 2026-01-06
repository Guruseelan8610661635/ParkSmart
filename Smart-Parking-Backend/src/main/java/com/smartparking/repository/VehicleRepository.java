package com.smartparking.repository;

import com.smartparking.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByUserId(Long userId);
    Optional<Vehicle> findByRegistrationNumber(String registrationNumber);
    Optional<Vehicle> findByUserIdAndIsDefault(Long userId, Boolean isDefault);
}
