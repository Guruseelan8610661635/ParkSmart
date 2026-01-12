package com.smartparking.dto;

import java.time.LocalDate;

public class PredictiveAnalyticsDTO {
    private LocalDate forecastDate;
    private Double predictedOccupancy;
    private Double predictedRevenue;
    private Double confidence; // 0-1
    private String trendDirection; // UP, DOWN, STABLE

    // Constructors
    public PredictiveAnalyticsDTO() {}

    public PredictiveAnalyticsDTO(LocalDate forecastDate, Double predictedOccupancy, Double predictedRevenue,
                                  Double confidence, String trendDirection) {
        this.forecastDate = forecastDate;
        this.predictedOccupancy = predictedOccupancy;
        this.predictedRevenue = predictedRevenue;
        this.confidence = confidence;
        this.trendDirection = trendDirection;
    }

    // Getters and Setters
    public LocalDate getForecastDate() {
        return forecastDate;
    }

    public void setForecastDate(LocalDate forecastDate) {
        this.forecastDate = forecastDate;
    }

    public Double getPredictedOccupancy() {
        return predictedOccupancy;
    }

    public void setPredictedOccupancy(Double predictedOccupancy) {
        this.predictedOccupancy = predictedOccupancy;
    }

    public Double getPredictedRevenue() {
        return predictedRevenue;
    }

    public void setPredictedRevenue(Double predictedRevenue) {
        this.predictedRevenue = predictedRevenue;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public String getTrendDirection() {
        return trendDirection;
    }

    public void setTrendDirection(String trendDirection) {
        this.trendDirection = trendDirection;
    }
}
