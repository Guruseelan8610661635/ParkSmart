package com.smartparking.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "analytics")
public class Analytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long locationId;
    private LocalDateTime date;
    private Long totalBookings;
    private Long completedBookings;
    private Long cancelledBookings;
    private Double totalRevenue;
    private Integer peakHour;
    private Double averageOccupancy;
    private Long totalUsers;
    private LocalDateTime recordedAt;

    public Analytics() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public Long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(Long totalBookings) { this.totalBookings = totalBookings; }

    public Long getCompletedBookings() { return completedBookings; }
    public void setCompletedBookings(Long completedBookings) { this.completedBookings = completedBookings; }

    public Long getCancelledBookings() { return cancelledBookings; }
    public void setCancelledBookings(Long cancelledBookings) { this.cancelledBookings = cancelledBookings; }

    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }

    public Integer getPeakHour() { return peakHour; }
    public void setPeakHour(Integer peakHour) { this.peakHour = peakHour; }

    public Double getAverageOccupancy() { return averageOccupancy; }
    public void setAverageOccupancy(Double averageOccupancy) { this.averageOccupancy = averageOccupancy; }

    public Long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
