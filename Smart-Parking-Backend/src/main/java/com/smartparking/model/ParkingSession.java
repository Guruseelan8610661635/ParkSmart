package com.smartparking.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "parking_sessions")
public class ParkingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long slotId;
    private Long bookingId;
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
    private String vehicleNumber;
    private String notes;
    private LocalDateTime createdAt;

    public ParkingSession() {}

    public ParkingSession(Long userId, Long slotId, Long bookingId, String vehicleNumber) {
        this.userId = userId;
        this.slotId = slotId;
        this.bookingId = bookingId;
        this.vehicleNumber = vehicleNumber;
        this.entryTime = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getSlotId() { return slotId; }
    public void setSlotId(Long slotId) { this.slotId = slotId; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public LocalDateTime getEntryTime() { return entryTime; }
    public void setEntryTime(LocalDateTime entryTime) { this.entryTime = entryTime; }

    public LocalDateTime getExitTime() { return exitTime; }
    public void setExitTime(LocalDateTime exitTime) { this.exitTime = exitTime; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
