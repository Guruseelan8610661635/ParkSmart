package com.smartparking.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.smartparking.model.Analytics;

public interface AnalyticsRepository extends JpaRepository<Analytics, Long> {
    List<Analytics> findByLocationId(Long locationId);
    
    @Query("SELECT a FROM Analytics a WHERE a.locationId = :locationId AND a.date BETWEEN :startDate AND :endDate")
    List<Analytics> findByLocationAndDateRange(
        @Param("locationId") Long locationId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT a FROM Analytics a WHERE a.date BETWEEN :startDate AND :endDate ORDER BY a.totalRevenue DESC")
    List<Analytics> findTopPerformingDays(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
}
