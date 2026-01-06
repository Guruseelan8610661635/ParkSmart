package com.smartparking.dto;

import java.time.LocalDateTime;

public class OccupancyStatisticsRequest {
    private Long locationId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String timeGranularity; // HOURLY, DAILY, WEEKLY, MONTHLY
    private Integer limit = 100;

    public OccupancyStatisticsRequest() {}

    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public String getTimeGranularity() { return timeGranularity; }
    public void setTimeGranularity(String timeGranularity) { this.timeGranularity = timeGranularity; }

    public Integer getLimit() { return limit; }
    public void setLimit(Integer limit) { this.limit = limit; }
}
