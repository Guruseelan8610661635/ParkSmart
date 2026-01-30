package com.smartparking.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.smartparking.dto.SmsNotificationRequest;
import com.smartparking.service.SmsService;

@RestController
@RequestMapping("/api/sms")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin
public class SmsController {

    @Autowired
    private SmsService smsService;

    @PostMapping("/send")
    public ResponseEntity<?> sendSms(@RequestBody SmsNotificationRequest request) {
        try {
            Boolean sent = smsService.sendSms(request.getPhoneNumber(), request.getMessage());
            
            if (sent) {
                return ResponseEntity.ok(Map.of("message", "SMS sent successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Failed to send SMS"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/booking-confirmation")
    public ResponseEntity<?> sendBookingConfirmation(
            @RequestParam String phoneNumber,
            @RequestParam Long bookingId,
            @RequestParam String slotNumber) {
        try {
            Boolean sent = smsService.sendBookingConfirmationSms(phoneNumber, bookingId, slotNumber);
            return ResponseEntity.ok(Map.of("sent", sent));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/payment-alert")
    public ResponseEntity<?> sendPaymentAlert(
            @RequestParam String phoneNumber,
            @RequestParam Double amount) {
        try {
            Boolean sent = smsService.sendPaymentAlertSms(phoneNumber, amount);
            return ResponseEntity.ok(Map.of("sent", sent));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/parking-reminder")
    public ResponseEntity<?> sendParkingReminder(
            @RequestParam String phoneNumber,
            @RequestParam String duration) {
        try {
            Boolean sent = smsService.sendParkingReminderSms(phoneNumber, duration);
            return ResponseEntity.ok(Map.of("sent", sent));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
