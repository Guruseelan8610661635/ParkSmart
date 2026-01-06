package com.smartparking.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.smartparking.model.Analytics;
import com.smartparking.service.AnalyticsService;

@RestController
@RequestMapping("/api/admin/analytics")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/location/{locationId}")
    public ResponseEntity<?> getLocationAnalytics(@PathVariable Long locationId) {
        try {
            List<Analytics> analytics = analyticsService.getLocationAnalytics(locationId);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/location/{locationId}/date-range")
    public ResponseEntity<?> getAnalyticsByDateRange(
            @PathVariable Long locationId,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        try {
            List<Analytics> analytics = analyticsService.getAnalyticsByDateRange(locationId, startDate, endDate);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/top-performing-days")
    public ResponseEntity<?> getTopPerformingDays(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        try {
            List<Analytics> analytics = analyticsService.getTopPerformingDays(startDate, endDate);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/location/{locationId}/latest")
    public ResponseEntity<?> getLatestAnalytics(@PathVariable Long locationId) {
        try {
            Analytics analytics = analyticsService.getLatestAnalytics(locationId);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createAnalytics(@RequestBody Analytics analytics) {
        try {
            Analytics created = analyticsService.createAnalytics(analytics);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
