package com.smartparking.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.smartparking.dto.FeedbackRequest;
import com.smartparking.model.Feedback;
import com.smartparking.service.FeedbackService;
import com.smartparking.service.BookingService;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> submitFeedback(@RequestBody FeedbackRequest request, Authentication authentication) {
        try {
            String email = authentication.getName();
            Long userId = bookingService.getUserIdByEmail(email);
            request.setUserId(userId);
            
            Feedback feedback = feedbackService.submitFeedback(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(feedback);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyFeedback(Authentication authentication) {
        try {
            String email = authentication.getName();
            Long userId = bookingService.getUserIdByEmail(email);
            
            List<Feedback> feedback = feedbackService.getUserFeedback(userId);
            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getBookingFeedback(@PathVariable Long bookingId) {
        try {
            List<Feedback> feedback = feedbackService.getBookingFeedback(bookingId);
            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<?> getFeedbackByCategory(@PathVariable String category) {
        try {
            List<Feedback> feedback = feedbackService.getFeedbackByCategory(category);
            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getFeedbackStatistics() {
        try {
            Map<String, Object> stats = feedbackService.getFeedbackStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
