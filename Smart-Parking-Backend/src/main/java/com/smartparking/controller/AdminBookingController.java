package com.smartparking.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.smartparking.dto.BookingResponse;
import com.smartparking.model.Booking;
import com.smartparking.service.BookingService;

/**
 * Admin Booking Controller
 * Provides booking overview and statistics for administrators
 * All endpoints require ADMIN authority
 */
@RestController
@RequestMapping("/api/admin/bookings")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminBookingController {

    @Autowired
    private BookingService bookingService;

    /**
     * Get all bookings overview
     * GET /api/admin/bookings
     * Returns all bookings in the system with comprehensive details
     */
    @GetMapping
    public ResponseEntity<?> getAllBookings() {
        try {
            List<Booking> bookings = bookingService.getAllBookings();
            List<BookingResponse> responses = bookingService.convertToResponseList(bookings);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve bookings: " + e.getMessage()));
        }
    }

    /**
     * Get bookings by status
     * GET /api/admin/bookings/status/{status}
     * Returns bookings filtered by status (ACTIVE, COMPLETED, CANCELLED)
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getBookingsByStatus(@PathVariable String status) {
        try {
            Booking.ParkingStatus parkingStatus = Booking.ParkingStatus.valueOf(status.toUpperCase());
            List<Booking> bookings = bookingService.getBookingsByStatus(parkingStatus);
            List<BookingResponse> responses = bookingService.convertToResponseList(bookings);
            return ResponseEntity.ok(responses);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid status. Valid values: ACTIVE, COMPLETED, CANCELLED"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve bookings: " + e.getMessage()));
        }
    }

    /**
     * Get bookings for a specific user
     * GET /api/admin/bookings/user/{userId}
     * Returns all bookings for a given user ID
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getBookingsByUser(@PathVariable Long userId) {
        try {
            List<Booking> bookings = bookingService.getBookingsByUser(userId);
            List<BookingResponse> responses = bookingService.convertToResponseList(bookings);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve bookings: " + e.getMessage()));
        }
    }

    /**
     * Get bookings for a specific parking slot
     * GET /api/admin/bookings/slot/{slotId}
     * Returns all bookings for a given slot ID
     */
    @GetMapping("/slot/{slotId}")
    public ResponseEntity<?> getBookingsBySlot(@PathVariable Long slotId) {
        try {
            List<Booking> bookings = bookingService.getBookingsBySlot(slotId);
            List<BookingResponse> responses = bookingService.convertToResponseList(bookings);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve bookings: " + e.getMessage()));
        }
    }

    /**
     * Get active bookings overview
     * GET /api/admin/bookings/overview/active
     * Returns all currently active bookings with quick statistics
     */
    @GetMapping("/overview/active")
    public ResponseEntity<?> getActiveBookingsOverview() {
        try {
            List<Booking> activeBookings = bookingService.getBookingsByStatus(Booking.ParkingStatus.ACTIVE);
            
            Map<String, Object> overview = Map.of(
                    "totalActive", activeBookings.size(),
                    "bookings", bookingService.convertToResponseList(activeBookings)
            );
            
            return ResponseEntity.ok(overview);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve active bookings: " + e.getMessage()));
        }
    }

    /**
     * Get completed bookings overview
     * GET /api/admin/bookings/overview/completed
     * Returns all completed bookings for today or within a date range
     */
    @GetMapping("/overview/completed")
    public ResponseEntity<?> getCompletedBookingsOverview() {
        try {
            List<Booking> completedBookings = bookingService.getBookingsByStatus(Booking.ParkingStatus.COMPLETED);
            
            Map<String, Object> overview = Map.of(
                    "totalCompleted", completedBookings.size(),
                    "bookings", bookingService.convertToResponseList(completedBookings)
            );
            
            return ResponseEntity.ok(overview);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve completed bookings: " + e.getMessage()));
        }
    }

    /**
     * Get booking statistics dashboard
     * GET /api/admin/bookings/dashboard/stats
     * Returns comprehensive statistics including total bookings, revenue, etc.
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getBookingStatistics() {
        try {
            Map<String, Object> stats = bookingService.getBookingStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve statistics: " + e.getMessage()));
        }
    }

    /**
     * Get booking details by ID
     * GET /api/admin/bookings/{bookingId}
     */
    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBookingDetails(@PathVariable Long bookingId) {
        try {
            Booking booking = bookingService.getBookingById(bookingId);
            BookingResponse response = bookingService.convertToResponse(booking);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Booking not found: " + e.getMessage()));
        }
    }

    /**
     * Cancel a booking (Admin action)
     * DELETE /api/admin/bookings/{bookingId}
     * Allows admin to cancel any booking
     */
    @DeleteMapping("/{bookingId}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long bookingId) {
        try {
            bookingService.cancelBooking(bookingId);
            return ResponseEntity.ok(Map.of("message", "Booking cancelled successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to cancel booking: " + e.getMessage()));
        }
    }

    /**
     * Get revenue summary
     * GET /api/admin/bookings/revenue/summary
     * Returns total revenue, average fee, etc.
     */
    @GetMapping("/revenue/summary")
    public ResponseEntity<?> getRevenueSummary() {
        try {
            Map<String, Object> revenueSummary = bookingService.getRevenueSummary();
            return ResponseEntity.ok(revenueSummary);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve revenue summary: " + e.getMessage()));
        }
    }

    /**
     * Get active bookings by location
     * GET /api/admin/bookings/location/{locationId}/active
     */
    @GetMapping("/location/{locationId}/active")
    public ResponseEntity<?> getActiveBookingsByLocation(@PathVariable Long locationId) {
        try {
            List<Booking> bookings = bookingService.getActiveBookingsByLocation(locationId);
            List<BookingResponse> responses = bookingService.convertToResponseList(bookings);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve bookings: " + e.getMessage()));
        }
    }

    /**
     * Search bookings within date range
     * GET /api/admin/bookings/search?startDate=2024-01-01T00:00:00&endDate=2024-01-31T23:59:59
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchBookings(
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate) {
        try {
            List<Booking> bookings = bookingService.searchBookingsByDateRange(startDate, endDate);
            List<BookingResponse> responses = bookingService.convertToResponseList(bookings);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to search bookings: " + e.getMessage()));
        }
    }
}
