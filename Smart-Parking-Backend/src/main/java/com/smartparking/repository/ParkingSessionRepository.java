package com.smartparking.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.smartparking.model.ParkingSession;

public interface ParkingSessionRepository extends JpaRepository<ParkingSession, Long> {
    List<ParkingSession> findByUserId(Long userId);
    List<ParkingSession> findBySlotId(Long slotId);
    List<ParkingSession> findByBookingId(Long bookingId);
    
    @Query("SELECT p FROM ParkingSession p WHERE p.userId = :userId AND p.exitTime IS NULL")
    List<ParkingSession> findActiveSessionsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT p FROM ParkingSession p WHERE p.entryTime BETWEEN :startDate AND :endDate")
    List<ParkingSession> findSessionsByDateRange(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
}
