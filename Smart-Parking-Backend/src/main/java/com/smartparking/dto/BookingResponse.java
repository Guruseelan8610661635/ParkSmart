package com.smartparking.dto;

import java.time.LocalDateTime;

public class BookingResponse {

    private Long id;
    private Long slotId;                // Slot ID
    private String slotNumber;
    private String vehicleType;         // Vehicle type (BIKE, CAR, SUV, TRUCK)
    private LocalDateTime entryTime;
    private LocalDateTime exitTime;
    private Long durationMinutes;       // Duration in minutes
    private String locationName;        // Location name for display
    private String status;              // ACTIVE, COMPLETED, CANCELLED
    private Double parkingFee;          // Calculated fee
    private String transactionId;       // Payment transaction ID
    
    // User information
    private UserInfo user;              // User details (name, email, etc.)

    // Full constructor with duration and location
    public BookingResponse(
            Long id,
            Long slotId,
            String slotNumber,
            String vehicleType,
            LocalDateTime entryTime,
            LocalDateTime exitTime,
            Long durationMinutes,
            String locationName,
            String status,
            Double parkingFee,
            String transactionId
    ) {
        this.id = id;
        this.slotId = slotId;
        this.slotNumber = slotNumber;
        this.vehicleType = vehicleType;
        this.entryTime = entryTime;
        this.exitTime = exitTime;
        this.durationMinutes = durationMinutes;
        this.locationName = locationName;
        this.status = status;
        this.parkingFee = parkingFee;
        this.transactionId = transactionId;
    }

    public BookingResponse(
            Long id,
            Long slotId,
            String slotNumber,
            LocalDateTime entryTime,
            LocalDateTime exitTime,
            String status,
            Double parkingFee,
            String transactionId
    ) {
        this.id = id;
        this.slotId = slotId;
        this.slotNumber = slotNumber;
        this.entryTime = entryTime;
        this.exitTime = exitTime;
        this.status = status;
        this.parkingFee = parkingFee;
        this.transactionId = transactionId;
    }

    // Constructor with vehicle type
    public BookingResponse(
            Long id,
            Long slotId,
            String slotNumber,
            String vehicleType,
            LocalDateTime entryTime,
            LocalDateTime exitTime,
            String status,
            Double parkingFee,
            String transactionId
    ) {
        this.id = id;
        this.slotId = slotId;
        this.slotNumber = slotNumber;
        this.vehicleType = vehicleType;
        this.entryTime = entryTime;
        this.exitTime = exitTime;
        this.status = status;
        this.parkingFee = parkingFee;
        this.transactionId = transactionId;
    }

    // Backward compatibility constructor
    public BookingResponse(
            Long id,
            String slotNumber,
            LocalDateTime entryTime,
            LocalDateTime exitTime
    ) {
        this.id = id;
        this.slotNumber = slotNumber;
        this.entryTime = entryTime;
        this.exitTime = exitTime;
    }

    public Long getId() {
        return id;
    }

    public Long getSlotId() {
        return slotId;
    }

    public String getSlotNumber() {
        return slotNumber;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public LocalDateTime getEntryTime() {
        return entryTime;
    }

    public LocalDateTime getExitTime() {
        return exitTime;
    }

    public Long getDurationMinutes() {
        if (durationMinutes != null) {
            return durationMinutes;
        }
        // Calculate if not set
        if (entryTime != null && exitTime != null) {
            return java.time.temporal.ChronoUnit.MINUTES.between(entryTime, exitTime);
        }
        return 0L;
    }

    public void setDurationMinutes(Long durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getStatus() {
        return status;
    }

    public Double getParkingFee() {
        return parkingFee;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public UserInfo getUser() {
        return user;
    }

    public void setUser(UserInfo user) {
        this.user = user;
    }

    // Backward compatibility getters
    public LocalDateTime getStartTime() {
        return entryTime;
    }

    public LocalDateTime getEndTime() {
        return exitTime;
    }

    /**
     * Simple user info DTO embedded in BookingResponse
     */
    public static class UserInfo {
        private Long id;
        private String name;
        private String username;
        private String email;

        public UserInfo() {}

        public UserInfo(Long id, String name, String username, String email) {
            this.id = id;
            this.name = name;
            this.username = username;
            this.email = email;
        }

        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getUsername() {
            return username;
        }

        public String getEmail() {
            return email;
        }
    }
}
