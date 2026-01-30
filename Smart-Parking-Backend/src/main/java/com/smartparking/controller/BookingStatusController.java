package com.smartparking.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.smartparking.dto.BookingStatusDto;
import com.smartparking.service.BookingStatusService;

@RestController
@RequestMapping("/api/bookings/status")
@CrossOrigin
public class BookingStatusController {

    @Autowired
    private BookingStatusService bookingStatusService;

    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBookingStatus(@PathVariable Long bookingId) {
        try {
            long startTime = System.currentTimeMillis();

            BookingStatusDto status = bookingStatusService.getBookingStatus(bookingId);

            long fetchTime = System.currentTimeMillis() - startTime;

            return ResponseEntity.ok(Map.of(
                    "status", status,
                    "fetchTimeMs", fetchTime
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{bookingId}/quick")
    public ResponseEntity<?> getQuickBookingStatus(@PathVariable Long bookingId) {
        try {
            long startTime = System.currentTimeMillis();

            BookingStatusDto status = bookingStatusService.getQuickBookingStatus(bookingId);

            long fetchTime = System.currentTimeMillis() - startTime;

            return ResponseEntity.ok(Map.of(
                    "status", status,
                    "fetchTimeMs", fetchTime
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{bookingId}/live")
    public ResponseEntity<?> getLiveBookingStatus(@PathVariable Long bookingId, Authentication authentication) {
        try {
            long startTime = System.currentTimeMillis();

            BookingStatusDto status = bookingStatusService.getBookingStatus(bookingId);
            long fetchTime = System.currentTimeMillis() - startTime;

            return ResponseEntity.ok(Map.of(
                    "bookingId", bookingId,
                    "status", status.getStatus(),
                    "slot", status.getCurrentSlot(),
                    "location", status.getCurrentLocation(),
                    "durationMinutes", status.getDurationSoFarMinutes(),
                    "estimatedFee", status.getEstimatedFee(),
                    "isOvertime", status.getIsOvertime(),
                    "timestamp", System.currentTimeMillis(),
                    "fetchTimeMs", fetchTime
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
