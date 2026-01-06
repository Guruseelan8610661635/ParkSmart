package com.smartparking.dto;

import java.time.LocalDateTime;

public class ReportResponse {
    private Long reportId;
    private String reportType;
    private LocalDateTime generatedDate;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Long totalBookings;
    private Long completedBookings;
    private Long activeBookings;
    private Long cancelledBookings;
    private Double totalRevenue;
    private Double averageFee;
    private Integer occupancyRate;
    private Long totalSlots;
    private Long availableSlots;
    private String reportFormat; // PDF, CSV, JSON

    public ReportResponse() {}

    public ReportResponse(String reportType, LocalDateTime generatedDate, Long totalBookings, 
                         Double totalRevenue, Integer occupancyRate) {
        this.reportType = reportType;
        this.generatedDate = generatedDate;
        this.totalBookings = totalBookings;
        this.totalRevenue = totalRevenue;
        this.occupancyRate = occupancyRate;
    }

    public Long getReportId() { return reportId; }
    public void setReportId(Long reportId) { this.reportId = reportId; }

    public String getReportType() { return reportType; }
    public void setReportType(String reportType) { this.reportType = reportType; }

    public LocalDateTime getGeneratedDate() { return generatedDate; }
    public void setGeneratedDate(LocalDateTime generatedDate) { this.generatedDate = generatedDate; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public Long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(Long totalBookings) { this.totalBookings = totalBookings; }

    public Long getCompletedBookings() { return completedBookings; }
    public void setCompletedBookings(Long completedBookings) { this.completedBookings = completedBookings; }

    public Long getActiveBookings() { return activeBookings; }
    public void setActiveBookings(Long activeBookings) { this.activeBookings = activeBookings; }

    public Long getCancelledBookings() { return cancelledBookings; }
    public void setCancelledBookings(Long cancelledBookings) { this.cancelledBookings = cancelledBookings; }

    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }

    public Double getAverageFee() { return averageFee; }
    public void setAverageFee(Double averageFee) { this.averageFee = averageFee; }

    public Integer getOccupancyRate() { return occupancyRate; }
    public void setOccupancyRate(Integer occupancyRate) { this.occupancyRate = occupancyRate; }

    public Long getTotalSlots() { return totalSlots; }
    public void setTotalSlots(Long totalSlots) { this.totalSlots = totalSlots; }

    public Long getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(Long availableSlots) { this.availableSlots = availableSlots; }

    public String getReportFormat() { return reportFormat; }
    public void setReportFormat(String reportFormat) { this.reportFormat = reportFormat; }
}
