package com.smartparking.dto;

import java.util.List;

public class BookingHistoryResponse {
    private List<BookingDetailDto> bookings;
    private Long totalRecords;
    private Integer pageNumber;
    private Integer pageSize;
    private Integer totalPages;
    private Boolean hasNextPage;
    private Long currentActiveBookings;
    private Long completedBookings;
    private Long cancelledBookings;
    private Long fetchTimeMs;

    public BookingHistoryResponse() {}

    public List<BookingDetailDto> getBookings() { return bookings; }
    public void setBookings(List<BookingDetailDto> bookings) { this.bookings = bookings; }

    public Long getTotalRecords() { return totalRecords; }
    public void setTotalRecords(Long totalRecords) { this.totalRecords = totalRecords; }

    public Integer getPageNumber() { return pageNumber; }
    public void setPageNumber(Integer pageNumber) { this.pageNumber = pageNumber; }

    public Integer getPageSize() { return pageSize; }
    public void setPageSize(Integer pageSize) { this.pageSize = pageSize; }

    public Integer getTotalPages() { return totalPages; }
    public void setTotalPages(Integer totalPages) { this.totalPages = totalPages; }

    public Boolean getHasNextPage() { return hasNextPage; }
    public void setHasNextPage(Boolean hasNextPage) { this.hasNextPage = hasNextPage; }

    public Long getCurrentActiveBookings() { return currentActiveBookings; }
    public void setCurrentActiveBookings(Long currentActiveBookings) { this.currentActiveBookings = currentActiveBookings; }

    public Long getCompletedBookings() { return completedBookings; }
    public void setCompletedBookings(Long completedBookings) { this.completedBookings = completedBookings; }

    public Long getCancelledBookings() { return cancelledBookings; }
    public void setCancelledBookings(Long cancelledBookings) { this.cancelledBookings = cancelledBookings; }

    public Long getFetchTimeMs() { return fetchTimeMs; }
    public void setFetchTimeMs(Long fetchTimeMs) { this.fetchTimeMs = fetchTimeMs; }
}
