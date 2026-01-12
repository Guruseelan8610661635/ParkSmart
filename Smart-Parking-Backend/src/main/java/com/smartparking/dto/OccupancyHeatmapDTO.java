package com.smartparking.dto;

public class OccupancyHeatmapDTO {
    private Integer hourOfDay;
    private Integer dayOfWeek;
    private Double occupancyPercentage;
    private Integer bookingCount;
    private Double avgDuration;

    public OccupancyHeatmapDTO() {}

    public OccupancyHeatmapDTO(Integer hourOfDay, Integer dayOfWeek, Double occupancyPercentage,
                               Integer bookingCount, Double avgDuration) {
        this.hourOfDay = hourOfDay;
        this.dayOfWeek = dayOfWeek;
        this.occupancyPercentage = occupancyPercentage;
        this.bookingCount = bookingCount;
        this.avgDuration = avgDuration;
    }

    public Integer getHourOfDay() { return hourOfDay; }
    public void setHourOfDay(Integer hourOfDay) { this.hourOfDay = hourOfDay; }
    public Integer getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(Integer dayOfWeek) { this.dayOfWeek = dayOfWeek; }
    public Double getOccupancyPercentage() { return occupancyPercentage; }
    public void setOccupancyPercentage(Double occupancyPercentage) { this.occupancyPercentage = occupancyPercentage; }
    public Integer getBookingCount() { return bookingCount; }
    public void setBookingCount(Integer bookingCount) { this.bookingCount = bookingCount; }
    public Double getAvgDuration() { return avgDuration; }
    public void setAvgDuration(Double avgDuration) { this.avgDuration = avgDuration; }
}
