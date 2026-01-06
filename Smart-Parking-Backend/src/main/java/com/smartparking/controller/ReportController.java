package com.smartparking.controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.smartparking.dto.ReportRequest;
import com.smartparking.dto.ReportResponse;
import com.smartparking.service.ReportService;

@RestController
@RequestMapping("/api/admin/reports")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/daily")
    public ResponseEntity<?> getDailyReport() {
        try {
            ReportResponse report = reportService.generateDailyReport();
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/weekly")
    public ResponseEntity<?> getWeeklyReport() {
        try {
            ReportResponse report = reportService.generateWeeklyReport();
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/monthly")
    public ResponseEntity<?> getMonthlyReport() {
        try {
            ReportResponse report = reportService.generateMonthlyReport();
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/custom")
    public ResponseEntity<?> getCustomReport(@RequestBody ReportRequest reportRequest) {
        try {
            ReportResponse report = reportService.generateReport(
                    reportRequest.getStartDate(),
                    reportRequest.getEndDate(),
                    reportRequest.getReportType()
            );
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
