package com.smartparking.dto;

import java.time.LocalDateTime;

public class UserBehaviorDTO {
    private Long userId;
    private String userName;
    private String email;
    private Integer totalBookings;
    private Double totalSpent;
    private Double avgDuration;
    private LocalDateTime lastBookingDate;
    private String userSegment;
    private Double avgBookingFrequency;

    public UserBehaviorDTO() {}

    public UserBehaviorDTO(Long userId, String userName, String email, Integer totalBookings,
                           Double totalSpent, Double avgDuration, LocalDateTime lastBookingDate,
                           String userSegment, Double avgBookingFrequency) {
        this.userId = userId;
        this.userName = userName;
        this.email = email;
        this.totalBookings = totalBookings;
        this.totalSpent = totalSpent;
        this.avgDuration = avgDuration;
        this.lastBookingDate = lastBookingDate;
        this.userSegment = userSegment;
        this.avgBookingFrequency = avgBookingFrequency;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Integer getTotalBookings() { return totalBookings; }
    public void setTotalBookings(Integer totalBookings) { this.totalBookings = totalBookings; }
    public Double getTotalSpent() { return totalSpent; }
    public void setTotalSpent(Double totalSpent) { this.totalSpent = totalSpent; }
    public Double getAvgDuration() { return avgDuration; }
    public void setAvgDuration(Double avgDuration) { this.avgDuration = avgDuration; }
    public LocalDateTime getLastBookingDate() { return lastBookingDate; }
    public void setLastBookingDate(LocalDateTime lastBookingDate) { this.lastBookingDate = lastBookingDate; }
    public String getUserSegment() { return userSegment; }
    public void setUserSegment(String userSegment) { this.userSegment = userSegment; }
    public Double getAvgBookingFrequency() { return avgBookingFrequency; }
    public void setAvgBookingFrequency(Double avgBookingFrequency) { this.avgBookingFrequency = avgBookingFrequency; }
}
