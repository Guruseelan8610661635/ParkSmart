package com.smartparking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@smartparking.com}")
    private String fromEmail;

    /**
     * Send OTP email to admin
     */
    public boolean sendOTPEmail(String toEmail, String otp) {
        try {
            if (mailSender == null) {
                // Fallback: Print to console if email not configured
                System.out.println("═══════════════════════════════════════");
                System.out.println("📧 OTP EMAIL (Email not configured)");
                System.out.println("═══════════════════════════════════════");
                System.out.println("To: " + toEmail);
                System.out.println("OTP Code: " + otp);
                System.out.println("Valid for: 5 minutes");
                System.out.println("═══════════════════════════════════════");
                return true;
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("🔐 Admin Login - OTP Verification");
            message.setText(
                "Dear Admin,\n\n" +
                "Your One-Time Password (OTP) for admin login is:\n\n" +
                "OTP: " + otp + "\n\n" +
                "This OTP is valid for 5 minutes.\n\n" +
                "If you did not request this OTP, please ignore this email.\n\n" +
                "Best regards,\n" +
                "Smart Parking System"
            );

            mailSender.send(message);
            System.out.println("✅ OTP Email sent to: " + toEmail);
            return true;
        } catch (Exception e) {
            System.err.println("❌ Failed to send OTP email: " + e.getMessage());
            // Fallback: Print to console
            System.out.println("═══════════════════════════════════════");
            System.out.println("📧 OTP EMAIL (Fallback)");
            System.out.println("═══════════════════════════════════════");
            System.out.println("To: " + toEmail);
            System.out.println("OTP Code: " + otp);
            System.out.println("Valid for: 5 minutes");
            System.out.println("═══════════════════════════════════════");
            return true;
        }
    }
}
