package com.smartparking.repository;

import com.smartparking.model.AdminOTP;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

public interface AdminOTPRepository extends JpaRepository<AdminOTP, Long> {
    Optional<AdminOTP> findByEmailAndOtpAndVerifiedFalseAndExpiresAtAfter(
        String email, String otp, LocalDateTime now);
    
    Optional<AdminOTP> findTopByEmailAndVerifiedFalseOrderByCreatedAtDesc(String email);
    
    List<AdminOTP> findByEmailAndVerifiedFalse(String email);
    
    void deleteByExpiresAtBefore(LocalDateTime now);
}
