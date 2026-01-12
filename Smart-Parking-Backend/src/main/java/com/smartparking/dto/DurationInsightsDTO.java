package com.smartparking.dto;

import java.util.Map;

public class DurationInsightsDTO {
    private Map<String, Integer> durationRanges; // short, medium, long stay counts
    private Map<Integer, Double> avgDurationByHour;
    private Integer shortStayCount; // < 1 hour
    private Integer mediumStayCount; // 1-3 hours
    private Integer longStayCount; // > 3 hours
    private Double avgShortStayDuration;
    private Double avgMediumStayDuration;
    private Double avgLongStayDuration;
    private Integer overstayCount;
    private Double overstayRevenue;

    // Constructors
    public DurationInsightsDTO() {}

    public DurationInsightsDTO(Map<String, Integer> durationRanges, Map<Integer, Double> avgDurationByHour,
                               Integer shortStayCount, Integer mediumStayCount, Integer longStayCount,
                               Double avgShortStayDuration, Double avgMediumStayDuration, Double avgLongStayDuration,
                               Integer overstayCount, Double overstayRevenue) {
        this.durationRanges = durationRanges;
        this.avgDurationByHour = avgDurationByHour;
        this.shortStayCount = shortStayCount;
        this.mediumStayCount = mediumStayCount;
        this.longStayCount = longStayCount;
        this.avgShortStayDuration = avgShortStayDuration;
        this.avgMediumStayDuration = avgMediumStayDuration;
        this.avgLongStayDuration = avgLongStayDuration;
        this.overstayCount = overstayCount;
        this.overstayRevenue = overstayRevenue;
    }

    // Getters and Setters
    public Map<String, Integer> getDurationRanges() {
        return durationRanges;
    }

    public void setDurationRanges(Map<String, Integer> durationRanges) {
        this.durationRanges = durationRanges;
    }

    public Map<Integer, Double> getAvgDurationByHour() {
        return avgDurationByHour;
    }

    public void setAvgDurationByHour(Map<Integer, Double> avgDurationByHour) {
        this.avgDurationByHour = avgDurationByHour;
    }

    public Integer getShortStayCount() {
        return shortStayCount;
    }

    public void setShortStayCount(Integer shortStayCount) {
        this.shortStayCount = shortStayCount;
    }

    public Integer getMediumStayCount() {
        return mediumStayCount;
    }

    public void setMediumStayCount(Integer mediumStayCount) {
        this.mediumStayCount = mediumStayCount;
    }

    public Integer getLongStayCount() {
        return longStayCount;
    }

    public void setLongStayCount(Integer longStayCount) {
        this.longStayCount = longStayCount;
    }

    public Double getAvgShortStayDuration() {
        return avgShortStayDuration;
    }

    public void setAvgShortStayDuration(Double avgShortStayDuration) {
        this.avgShortStayDuration = avgShortStayDuration;
    }

    public Double getAvgMediumStayDuration() {
        return avgMediumStayDuration;
    }

    public void setAvgMediumStayDuration(Double avgMediumStayDuration) {
        this.avgMediumStayDuration = avgMediumStayDuration;
    }

    public Double getAvgLongStayDuration() {
        return avgLongStayDuration;
    }

    public void setAvgLongStayDuration(Double avgLongStayDuration) {
        this.avgLongStayDuration = avgLongStayDuration;
    }

    public Integer getOverstayCount() {
        return overstayCount;
    }

    public void setOverstayCount(Integer overstayCount) {
        this.overstayCount = overstayCount;
    }

    public Double getOverstayRevenue() {
        return overstayRevenue;
    }

    public void setOverstayRevenue(Double overstayRevenue) {
        this.overstayRevenue = overstayRevenue;
    }
}
