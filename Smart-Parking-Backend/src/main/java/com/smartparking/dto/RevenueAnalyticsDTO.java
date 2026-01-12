package com.smartparking.dto;

import java.util.Map;

public class RevenueAnalyticsDTO {
    private Double totalRevenue;
    private Double dailyAvgRevenue;
    private Double weeklyAvgRevenue;
    private Double monthlyAvgRevenue;
    private Map<String, Double> revenueByLocation;
    private Map<Integer, Double> revenueByHour;
    private Double revenueGrowth;
    private Double peakHourRevenue;
    private Integer peakHour;

    public RevenueAnalyticsDTO() {}

    public RevenueAnalyticsDTO(Double totalRevenue, Double dailyAvgRevenue, Double weeklyAvgRevenue,
                               Double monthlyAvgRevenue, Map<String, Double> revenueByLocation,
                               Map<Integer, Double> revenueByHour, Double revenueGrowth,
                               Double peakHourRevenue, Integer peakHour) {
        this.totalRevenue = totalRevenue;
        this.dailyAvgRevenue = dailyAvgRevenue;
        this.weeklyAvgRevenue = weeklyAvgRevenue;
        this.monthlyAvgRevenue = monthlyAvgRevenue;
        this.revenueByLocation = revenueByLocation;
        this.revenueByHour = revenueByHour;
        this.revenueGrowth = revenueGrowth;
        this.peakHourRevenue = peakHourRevenue;
        this.peakHour = peakHour;
    }

    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }
    public Double getDailyAvgRevenue() { return dailyAvgRevenue; }
    public void setDailyAvgRevenue(Double dailyAvgRevenue) { this.dailyAvgRevenue = dailyAvgRevenue; }
    public Double getWeeklyAvgRevenue() { return weeklyAvgRevenue; }
    public void setWeeklyAvgRevenue(Double weeklyAvgRevenue) { this.weeklyAvgRevenue = weeklyAvgRevenue; }
    public Double getMonthlyAvgRevenue() { return monthlyAvgRevenue; }
    public void setMonthlyAvgRevenue(Double monthlyAvgRevenue) { this.monthlyAvgRevenue = monthlyAvgRevenue; }
    public Map<String, Double> getRevenueByLocation() { return revenueByLocation; }
    public void setRevenueByLocation(Map<String, Double> revenueByLocation) { this.revenueByLocation = revenueByLocation; }
    public Map<Integer, Double> getRevenueByHour() { return revenueByHour; }
    public void setRevenueByHour(Map<Integer, Double> revenueByHour) { this.revenueByHour = revenueByHour; }
    public Double getRevenueGrowth() { return revenueGrowth; }
    public void setRevenueGrowth(Double revenueGrowth) { this.revenueGrowth = revenueGrowth; }
    public Double getPeakHourRevenue() { return peakHourRevenue; }
    public void setPeakHourRevenue(Double peakHourRevenue) { this.peakHourRevenue = peakHourRevenue; }
    public Integer getPeakHour() { return peakHour; }
    public void setPeakHour(Integer peakHour) { this.peakHour = peakHour; }
}
