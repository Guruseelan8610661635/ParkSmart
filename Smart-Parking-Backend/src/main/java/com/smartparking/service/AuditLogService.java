package com.smartparking.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartparking.model.AuditLog;
import com.smartparking.repository.AuditLogRepository;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void logAction(Long userId, String action, String entityType, Long entityId, String changes) {
        AuditLog log = new AuditLog(userId, action, entityType, entityId);
        log.setChanges(changes);
        auditLogRepository.save(log);
    }

    public void logAction(Long userId, String action, String entityType, Long entityId) {
        logAction(userId, action, entityType, entityId, null);
    }

    public List<AuditLog> getUserAuditLogs(Long userId) {
        return auditLogRepository.findByUserId(userId);
    }

    public List<AuditLog> getActionLogs(String action) {
        return auditLogRepository.findByAction(action);
    }

    public List<AuditLog> getEntityLogs(String entityType) {
        return auditLogRepository.findByEntityType(entityType);
    }

    public List<AuditLog> getLogsInDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return auditLogRepository.findByDateRange(startDate, endDate);
    }

    public List<AuditLog> getRecentUserActivity(Long userId, int hoursBack) {
        LocalDateTime fromDate = LocalDateTime.now().minusHours(hoursBack);
        return auditLogRepository.getRecentUserActivity(userId, fromDate);
    }
}
