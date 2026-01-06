package com.smartparking.service;

import com.smartparking.model.AdminOTP;
import com.smartparking.repository.AdminOTPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OTPService {

    @Autowired
    private AdminOTPRepository otpRepository;

    @Autowired
    private EmailService emailService;

    private static final int OTP_LENGTH = 6;
    private static final int OTP_VALIDITY_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 3;
    private static final SecureRandom random = new SecureRandom();

    /**
     * Generate and send OTP for admin login
     */
    @Transactional
    public boolean generateAndSendOTP(String email) {
        try {
            // Invalidate all previous OTPs for this email
            invalidatePreviousOTPs(email);

            // Generate new OTP
            String otp = generateOTP();

            // Save OTP to database
            AdminOTP adminOTP = new AdminOTP();
            adminOTP.setEmail(email);
            adminOTP.setOtp(otp);
            adminOTP.setCreatedAt(LocalDateTime.now());
            adminOTP.setExpiresAt(LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES));
            adminOTP.setVerified(false);
            adminOTP.setAttempts(0);

            otpRepository.save(adminOTP);

            // Send OTP via email
            boolean emailSent = emailService.sendOTPEmail(email, otp);

            if (emailSent) {
                System.out.println("✅ OTP generated and sent for: " + email);
                return true;
            } else {
                System.err.println("❌ Failed to send OTP email for: " + email);
                return false;
            }
        } catch (Exception e) {
            System.err.println("❌ Error generating OTP: " + e.getMessage());
            return false;
        }
    }

    /**
     * Verify OTP
     */
    @Transactional
    public boolean verifyOTP(String email, String otp) {
        try {
            // Find the latest unverified OTP for this email
            Optional<AdminOTP> otpOptional = otpRepository
                .findTopByEmailAndVerifiedFalseOrderByCreatedAtDesc(email);

            if (otpOptional.isEmpty()) {
                System.err.println("❌ No OTP found for email: " + email);
                return false;
            }

            AdminOTP adminOTP = otpOptional.get();

            // Check if OTP is expired
            if (LocalDateTime.now().isAfter(adminOTP.getExpiresAt())) {
                System.err.println("❌ OTP expired for email: " + email);
                return false;
            }

            // Check max attempts
            if (adminOTP.getAttempts() >= MAX_ATTEMPTS) {
                System.err.println("❌ Max OTP attempts exceeded for email: " + email);
                return false;
            }

            // Increment attempts
            adminOTP.setAttempts(adminOTP.getAttempts() + 1);
            otpRepository.save(adminOTP);

            // Verify OTP
            if (adminOTP.getOtp().equals(otp)) {
                adminOTP.setVerified(true);
                otpRepository.save(adminOTP);
                System.out.println("✅ OTP verified successfully for: " + email);
                return true;
            } else {
                System.err.println("❌ Invalid OTP for email: " + email);
                return false;
            }
        } catch (Exception e) {
            System.err.println("❌ Error verifying OTP: " + e.getMessage());
            return false;
        }
    }

    /**
     * Generate random 6-digit OTP
     */
    private String generateOTP() {
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    /**
     * Invalidate all previous OTPs for an email
     */
    @Transactional
    private void invalidatePreviousOTPs(String email) {
        List<AdminOTP> previousOTPs = otpRepository.findByEmailAndVerifiedFalse(email);
        previousOTPs.forEach(otp -> {
            otp.setVerified(true); // Mark as verified to invalidate
            otpRepository.save(otp);
        });
    }

    /**
     * Clean up expired OTPs (can be scheduled)
     */
    @Transactional
    public void cleanupExpiredOTPs() {
        otpRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}
