package com.smartparking.dto;

import java.time.LocalDateTime;

public class NotificationResponse {
    private Long notificationId;
    private String type;
    private String message;
    private Long userId;
    private Long bookingId;
    private Boolean isRead;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;

    public NotificationResponse() {}

    public NotificationResponse(Long notificationId, String type, String message, Long userId) {
        this.notificationId = notificationId;
        this.type = type;
        this.message = message;
        this.userId = userId;
        this.isRead = false;
        this.createdAt = LocalDateTime.now();
    }

    public Long getNotificationId() { return notificationId; }
    public void setNotificationId(Long notificationId) { this.notificationId = notificationId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getReadAt() { return readAt; }
    public void setReadAt(LocalDateTime readAt) { this.readAt = readAt; }
}
