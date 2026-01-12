package com.smartparking.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Comprehensive usage report response with detailed metrics
 * Including peak hours, average duration, and segmentation
 */
public class UsageReportResponse {
    
    // Basic report info
    private String reportType; // DAILY, WEEKLY, MONTHLY
    private LocalDateTime generatedDate;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    
    // Total bookings metrics
    private Long totalBookings;
    private Long completedBookings;
    private Long activeBookings;
    private Long cancelledBookings;
    
    // Revenue metrics
    private Double totalRevenue;
    private Double averageFee;
    private Double maxFee;
    private Double minFee;
    
    // Duration metrics
    private Double averageDurationMinutes;
    private Double maxDurationMinutes;
    private Double minDurationMinutes;
    private Double medianDurationMinutes;
    
    // Slot utilization
    private Long totalSlots;
    private Long availableSlots;
    private Integer occupancyRate;
    
    // Peak hours analysis (hour -> booking count)
    private Map<Integer, Long> peakHoursData;
    private List<PeakHourInfo> topPeakHours;
    
    // Daily/Weekly breakdown
    private Map<String, Long> dailyBreakdown;
    private Map<String, Double> dailyRevenueBreakdown;
    
    // User type segmentation (if userId patterns exist)
    private Map<String, Long> userTypeBookings;
    
    // Vehicle type breakdown
    private Map<String, Long> vehicleTypeBreakdown;
    
    // Status distribution
    private Map<String, Long> statusDistribution;
    
    // Constructors
    public UsageReportResponse() {}

    // Getters and Setters
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

    public Double getMaxFee() { return maxFee; }
    public void setMaxFee(Double maxFee) { this.maxFee = maxFee; }

    public Double getMinFee() { return minFee; }
    public void setMinFee(Double minFee) { this.minFee = minFee; }

    public Double getAverageDurationMinutes() { return averageDurationMinutes; }
    public void setAverageDurationMinutes(Double averageDurationMinutes) { this.averageDurationMinutes = averageDurationMinutes; }

    public Double getMaxDurationMinutes() { return maxDurationMinutes; }
    public void setMaxDurationMinutes(Double maxDurationMinutes) { this.maxDurationMinutes = maxDurationMinutes; }

    public Double getMinDurationMinutes() { return minDurationMinutes; }
    public void setMinDurationMinutes(Double minDurationMinutes) { this.minDurationMinutes = minDurationMinutes; }

    public Double getMedianDurationMinutes() { return medianDurationMinutes; }
    public void setMedianDurationMinutes(Double medianDurationMinutes) { this.medianDurationMinutes = medianDurationMinutes; }

    public Long getTotalSlots() { return totalSlots; }
    public void setTotalSlots(Long totalSlots) { this.totalSlots = totalSlots; }

    public Long getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(Long availableSlots) { this.availableSlots = availableSlots; }

    public Integer getOccupancyRate() { return occupancyRate; }
    public void setOccupancyRate(Integer occupancyRate) { this.occupancyRate = occupancyRate; }

    public Map<Integer, Long> getPeakHoursData() { return peakHoursData; }
    public void setPeakHoursData(Map<Integer, Long> peakHoursData) { this.peakHoursData = peakHoursData; }

    public List<PeakHourInfo> getTopPeakHours() { return topPeakHours; }
    public void setTopPeakHours(List<PeakHourInfo> topPeakHours) { this.topPeakHours = topPeakHours; }

    public Map<String, Long> getDailyBreakdown() { return dailyBreakdown; }
    public void setDailyBreakdown(Map<String, Long> dailyBreakdown) { this.dailyBreakdown = dailyBreakdown; }

    public Map<String, Double> getDailyRevenueBreakdown() { return dailyRevenueBreakdown; }
    public void setDailyRevenueBreakdown(Map<String, Double> dailyRevenueBreakdown) { this.dailyRevenueBreakdown = dailyRevenueBreakdown; }

    public Map<String, Long> getUserTypeBookings() { return userTypeBookings; }
    public void setUserTypeBookings(Map<String, Long> userTypeBookings) { this.userTypeBookings = userTypeBookings; }

    public Map<String, Long> getVehicleTypeBreakdown() { return vehicleTypeBreakdown; }
    public void setVehicleTypeBreakdown(Map<String, Long> vehicleTypeBreakdown) { this.vehicleTypeBreakdown = vehicleTypeBreakdown; }

    public Map<String, Long> getStatusDistribution() { return statusDistribution; }
    public void setStatusDistribution(Map<String, Long> statusDistribution) { this.statusDistribution = statusDistribution; }

    /**
     * Inner class for peak hour information
     */
    public static class PeakHourInfo {
        private Integer hour;
        private Long bookingCount;
        private String timeRange;

        public PeakHourInfo(Integer hour, Long bookingCount) {
            this.hour = hour;
            this.bookingCount = bookingCount;
            this.timeRange = String.format("%02d:00 - %02d:00", hour, (hour + 1) % 24);
        }

        public Integer getHour() { return hour; }
        public void setHour(Integer hour) { this.hour = hour; }

        public Long getBookingCount() { return bookingCount; }
        public void setBookingCount(Long bookingCount) { this.bookingCount = bookingCount; }

        public String getTimeRange() { return timeRange; }
        public void setTimeRange(String timeRange) { this.timeRange = timeRange; }
    }
}
