package com.smartparking.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartparking.model.ParkingSession;
import com.smartparking.repository.ParkingSessionRepository;

@Service
public class ParkingSessionService {

    @Autowired
    private ParkingSessionRepository parkingSessionRepository;

    public ParkingSession startSession(Long userId, Long slotId, Long bookingId, String vehicleNumber) {
        ParkingSession session = new ParkingSession(userId, slotId, bookingId, vehicleNumber);
        return parkingSessionRepository.save(session);
    }

    public ParkingSession endSession(Long sessionId) {
        ParkingSession session = parkingSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        session.setExitTime(LocalDateTime.now());
        return parkingSessionRepository.save(session);
    }

    public List<ParkingSession> getUserSessions(Long userId) {
        return parkingSessionRepository.findByUserId(userId);
    }

    public List<ParkingSession> getActiveUserSessions(Long userId) {
        return parkingSessionRepository.findActiveSessionsByUserId(userId);
    }

    public List<ParkingSession> getSessionsBySlot(Long slotId) {
        return parkingSessionRepository.findBySlotId(slotId);
    }

    public List<ParkingSession> getSessionsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return parkingSessionRepository.findSessionsByDateRange(startDate, endDate);
    }

    public ParkingSession getSessionById(Long sessionId) {
        return parkingSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
    }
}
