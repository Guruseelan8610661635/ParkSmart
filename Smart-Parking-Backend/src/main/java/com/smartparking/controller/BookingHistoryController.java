package com.smartparking.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.smartparking.dto.BookingDetailDto;
import com.smartparking.dto.BookingHistoryResponse;
import com.smartparking.service.BookingHistoryService;
import com.smartparking.service.BookingService;

@RestController
@RequestMapping("/api/bookings/history")
@CrossOrigin
public class BookingHistoryController {

    @Autowired
    private BookingHistoryService bookingHistoryService;

    @Autowired
    private BookingService bookingService;

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentBookings(
            Authentication authentication,
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        try {
            String email = authentication.getName();
            Long userId = bookingService.getUserIdByEmail(email);

            BookingHistoryResponse response = bookingHistoryService.getCurrentBookings(userId, pageNumber, pageSize);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/past")
    public ResponseEntity<?> getPastBookings(
            Authentication authentication,
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        try {
            String email = authentication.getName();
            Long userId = bookingService.getUserIdByEmail(email);

            BookingHistoryResponse response = bookingHistoryService.getPastBookings(userId, pageNumber, pageSize);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllBookings(
            Authentication authentication,
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        try {
            String email = authentication.getName();
            Long userId = bookingService.getUserIdByEmail(email);

            BookingHistoryResponse response = bookingHistoryService.getAllBookings(userId, pageNumber, pageSize);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<?> getFilteredBookings(
            Authentication authentication,
            @RequestParam(defaultValue = "ALL") String filterType,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        try {
            String email = authentication.getName();
            Long userId = bookingService.getUserIdByEmail(email);

            BookingHistoryResponse response = bookingHistoryService.getBookingsByFilter(
                    userId, filterType, startDate, endDate, pageNumber, pageSize);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBookingDetail(@PathVariable Long bookingId) {
        try {
            BookingDetailDto booking = bookingHistoryService.getBookingDetail(bookingId);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/quick/recent")
    public ResponseEntity<?> getRecentBookings(
            Authentication authentication,
            @RequestParam(defaultValue = "10") Integer limit) {
        try {
            String email = authentication.getName();
            Long userId = bookingService.getUserIdByEmail(email);

            List<BookingDetailDto> bookings = bookingHistoryService.getQuickBookingList(userId, limit);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/timestamps")
    public ResponseEntity<?> getBookingsWithTimestamps(
            Authentication authentication,
            @RequestParam(defaultValue = "CURRENT") String type) {
        try {
            String email = authentication.getName();
            Long userId = bookingService.getUserIdByEmail(email);

            BookingHistoryResponse response;
            if ("CURRENT".equalsIgnoreCase(type)) {
                response = bookingHistoryService.getCurrentBookings(userId, 0, Integer.MAX_VALUE);
            } else {
                response = bookingHistoryService.getPastBookings(userId, 0, Integer.MAX_VALUE);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchBookings(
            Authentication authentication,
            @RequestParam(required = false) String slotNumber,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        try {
            String email = authentication.getName();
            Long userId = bookingService.getUserIdByEmail(email);

            BookingHistoryResponse response = bookingHistoryService.getBookingsByFilter(
                    userId, "ALL", null, null, pageNumber, pageSize);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getBookingSummary(Authentication authentication) {
        try {
            String email = authentication.getName();
            Long userId = bookingService.getUserIdByEmail(email);

            Map<String, Object> summary = Map.of(
                    "currentActive", bookingHistoryService.getCurrentBookings(userId, 0, 1).getCurrentActiveBookings(),
                    "totalCompleted", bookingHistoryService.getAllBookings(userId, 0, 1).getCompletedBookings(),
                    "totalCancelled", bookingHistoryService.getAllBookings(userId, 0, 1).getCancelledBookings()
            );

            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
