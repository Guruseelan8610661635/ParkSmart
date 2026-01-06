package com.smartparking.dto;

import java.time.LocalDateTime;

public class BookingHistoryRequest {
    private Long userId;
    private String filterType; // ALL, CURRENT, PAST, ACTIVE, COMPLETED
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer pageNumber = 0;
    private Integer pageSize = 20;
    private String sortBy; // createdAt, entryTime, exitTime

    public BookingHistoryRequest() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFilterType() { return filterType; }
    public void setFilterType(String filterType) { this.filterType = filterType; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public Integer getPageNumber() { return pageNumber; }
    public void setPageNumber(Integer pageNumber) { this.pageNumber = pageNumber; }

    public Integer getPageSize() { return pageSize; }
    public void setPageSize(Integer pageSize) { this.pageSize = pageSize; }

    public String getSortBy() { return sortBy; }
    public void setSortBy(String sortBy) { this.sortBy = sortBy; }
}
