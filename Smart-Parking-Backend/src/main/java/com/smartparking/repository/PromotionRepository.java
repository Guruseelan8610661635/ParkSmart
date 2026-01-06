package com.smartparking.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.smartparking.model.Promotion;
import java.util.List;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    Optional<Promotion> findByCode(String code);
    
    @Query("SELECT p FROM Promotion p WHERE p.status = 'ACTIVE'")
    List<Promotion> findActivePromotions();
    
    @Query("SELECT p FROM Promotion p WHERE p.status = :status")
    List<Promotion> findByStatus(@Param("status") String status);
}
