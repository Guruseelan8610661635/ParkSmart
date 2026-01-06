package com.smartparking.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.smartparking.model.AuditLog;
import com.smartparking.service.AuditLogService;

@RestController
@RequestMapping("/api/admin/audit-logs")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserAuditLogs(@PathVariable Long userId) {
        try {
            List<AuditLog> logs = auditLogService.getUserAuditLogs(userId);
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/action/{action}")
    public ResponseEntity<?> getActionLogs(@PathVariable String action) {
        try {
            List<AuditLog> logs = auditLogService.getActionLogs(action);
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/entity/{entityType}")
    public ResponseEntity<?> getEntityLogs(@PathVariable String entityType) {
        try {
            List<AuditLog> logs = auditLogService.getEntityLogs(entityType);
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/date-range")
    public ResponseEntity<?> getLogsInDateRange(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        try {
            List<AuditLog> logs = auditLogService.getLogsInDateRange(startDate, endDate);
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}/recent")
    public ResponseEntity<?> getRecentUserActivity(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "24") int hoursBack) {
        try {
            List<AuditLog> logs = auditLogService.getRecentUserActivity(userId, hoursBack);
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
