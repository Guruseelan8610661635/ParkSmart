package com.smartparking.dto;

import java.time.LocalDateTime;

public class NotificationRequest {
    private String type; // BOOKING_CONFIRMED, BOOKING_CANCELLED, PAYMENT_RECEIVED, SLOT_AVAILABLE
    private String message;
    private Long userId;
    private Long bookingId;
    private LocalDateTime createdAt;

    public NotificationRequest() {}

    public NotificationRequest(String type, String message, Long userId) {
        this.type = type;
        this.message = message;
        this.userId = userId;
        this.createdAt = LocalDateTime.now();
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
