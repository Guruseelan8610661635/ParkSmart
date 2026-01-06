package com.smartparking.dto;

import java.time.LocalDateTime;

public class ReportRequest {
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String reportType; // DAILY, WEEKLY, MONTHLY, CUSTOM
    private Long locationId;

    public ReportRequest() {}

    public ReportRequest(LocalDateTime startDate, LocalDateTime endDate, String reportType, Long locationId) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.reportType = reportType;
        this.locationId = locationId;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public Long getLocationId() {
        return locationId;
    }

    public void setLocationId(Long locationId) {
        this.locationId = locationId;
    }
}
