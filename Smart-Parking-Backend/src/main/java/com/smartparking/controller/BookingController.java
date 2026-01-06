package com.smartparking.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.smartparking.dto.BookingResponse;
import com.smartparking.dto.CheckoutResponse;
import com.smartparking.model.Booking;
import com.smartparking.service.BookingService;

/**
 * Booking Controller
 * Handles parking slot booking, checkout, and booking history endpoints.
 */
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingService service;

    /**
     * Book a parking slot
     * POST /api/bookings/book
     */
    @PostMapping("/book")
    public ResponseEntity<?> bookSlot(
            @RequestBody Booking booking,
            Authentication authentication
    ) {
        try {
            String email = authentication.getName();
            Long userId = service.getUserIdByEmail(email);

            booking.setUserId(userId);
            service.bookSlot(booking);

            return ResponseEntity.ok(new BookingResponse(
                    booking.getId(),
                    booking.getSlotId(),
                    "Slot-" + booking.getSlotId(),
                    booking.getVehicleType() != null ? booking.getVehicleType().name() : "CAR",
                    booking.getEntryTime(),
                    booking.getExitTime(),
                    booking.getStatus().toString(),
                    null,
                    null
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Checkout a booking (exit parking slot)
     * POST /api/bookings/{bookingId}/checkout
     * Records exit time, calculates fee, processes payment
     */
    @PostMapping("/{bookingId}/checkout")
    public ResponseEntity<?> checkoutBooking(
            @PathVariable Long bookingId,
            Authentication authentication
    ) {
        try {
            String email = authentication.getName();
            Long userId = service.getUserIdByEmail(email);

            // Verify booking belongs to authenticated user
            Booking booking = service.getBookingById(bookingId);
            if (!booking.getUserId().equals(userId)) {
                return ResponseEntity.status(403).body("Unauthorized: Booking does not belong to user");
            }

            // Process checkout
            CheckoutResponse response = service.checkoutBooking(bookingId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Cancel a booking
     * DELETE /api/bookings/{bookingId}
     */
    @DeleteMapping("/{bookingId}")
    public ResponseEntity<?> cancelBooking(
            @PathVariable Long bookingId,
            Authentication authentication
    ) {
        try {
            String email = authentication.getName();
            Long userId = service.getUserIdByEmail(email);

            // Verify booking belongs to authenticated user
            Booking booking = service.getBookingById(bookingId);
            if (!booking.getUserId().equals(userId)) {
                return ResponseEntity.status(403).body("Unauthorized: Booking does not belong to user");
            }

            service.cancelBooking(bookingId);
            return ResponseEntity.ok("Booking cancelled successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Get all bookings for authenticated user
     * GET /api/bookings/my
     */
    @GetMapping("/my")
    public ResponseEntity<?> getUserBookings(Authentication auth) {
        System.out.println("🔵 ========================================");
        System.out.println("🔵 GET /api/bookings/my endpoint called");
        System.out.println("🔵 ========================================");
        
        // Check authentication
        if (auth == null) {
            System.out.println("❌ ERROR: Authentication is NULL");
            return ResponseEntity.status(401)
                .body(java.util.Map.of("error", "Not authenticated", "message", "Authentication object is null"));
        }
        
        System.out.println("✅ Authentication object: " + auth);
        System.out.println("✅ Authentication class: " + auth.getClass().getName());
        
        String email = null;
        try {
            email = auth.getName();
            System.out.println("📧 Email from token: " + email);
            
            if (email == null || email.isEmpty()) {
                System.out.println("❌ ERROR: Email is NULL or EMPTY");
                return ResponseEntity.status(400)
                    .body(java.util.Map.of("error", "Cannot extract email from token", "email", "null or empty"));
            }
            
        } catch (Exception e) {
            System.out.println("❌ ERROR extracting email from auth: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(400)
                .body(java.util.Map.of("error", "Failed to extract email", "message", e.getMessage()));
        }
        
        Long userId = null;
        try {
            System.out.println("🔍 Calling getUserIdByEmail with email: " + email);
            userId = service.getUserIdByEmail(email);
            System.out.println("👤 User ID retrieved: " + userId);
            
            if (userId == null) {
                System.out.println("❌ ERROR: User ID is NULL - User not found in database");
                return ResponseEntity.status(404)
                    .body(java.util.Map.of("error", "User not found", "email", email));
            }
            
        } catch (RuntimeException e) {
            System.out.println("❌ ERROR in getUserIdByEmail: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(400)
                .body(java.util.Map.of("error", "User lookup failed", "message", e.getMessage(), "email", email));
        } catch (Exception e) {
            System.out.println("❌ UNEXPECTED ERROR in getUserIdByEmail: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(java.util.Map.of("error", "Internal error during user lookup", "message", e.getMessage()));
        }
        
        try {
            System.out.println("📋 Calling getUserBookings with userId: " + userId);
            List<BookingResponse> bookings = service.getUserBookings(userId);
            System.out.println("✅ Bookings retrieved successfully: " + bookings.size() + " booking(s)");
            System.out.println("📋 Bookings: " + bookings);
            System.out.println("🔵 ========================================");
            System.out.println("🔵 SUCCESS - Returning " + bookings.size() + " bookings");
            System.out.println("🔵 ========================================");
            
            return ResponseEntity.ok(bookings);
            
        } catch (NullPointerException e) {
            System.out.println("❌ NULL POINTER ERROR in getUserBookings: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(java.util.Map.of("error", "Null pointer in booking retrieval", "message", e.getMessage(), "type", "NullPointerException"));
        } catch (Exception e) {
            System.out.println("❌ ERROR in getUserBookings: " + e.getMessage());
            System.out.println("❌ Error type: " + e.getClass().getName());
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(java.util.Map.of("error", "Failed to retrieve bookings", "message", e.getMessage(), "type", e.getClass().getName()));
        }
    }

    /**
     * Get booking details by ID
     * GET /api/bookings/{bookingId}
     */
    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBookingDetails(
            @PathVariable Long bookingId,
            Authentication authentication
    ) {
        try {
            String email = authentication.getName();
            Long userId = service.getUserIdByEmail(email);

            Booking booking = service.getBookingById(bookingId);
            if (!booking.getUserId().equals(userId)) {
                return ResponseEntity.status(403).body("Unauthorized: Booking does not belong to user");
            }

            BookingResponse response = new BookingResponse(
                    booking.getId(),
                    booking.getSlotId(),
                    "Slot-" + booking.getSlotId(),
                    booking.getVehicleType() != null ? booking.getVehicleType().name() : "CAR",
                    booking.getEntryTime(),
                    booking.getExitTime(),
                    booking.getStatus().toString(),
                    booking.getParkingFee(),
                    booking.getTransactionId()
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
