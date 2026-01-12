package com.smartparking.dto;

public class OperationalMetricsDTO {
    private Double cancellationRate;
    private Double noShowRate;
    private Double modificationRate;
    private Double avgBookingLeadTime; // hours before check-in
    private Double completionRate;
    private Integer totalCancellations;
    private Integer totalNoShows;
    private Integer totalModifications;
    private Integer totalCompletedBookings;

    // Constructors
    public OperationalMetricsDTO() {}

    public OperationalMetricsDTO(Double cancellationRate, Double noShowRate, Double modificationRate,
                                 Double avgBookingLeadTime, Double completionRate, Integer totalCancellations,
                                 Integer totalNoShows, Integer totalModifications, Integer totalCompletedBookings) {
        this.cancellationRate = cancellationRate;
        this.noShowRate = noShowRate;
        this.modificationRate = modificationRate;
        this.avgBookingLeadTime = avgBookingLeadTime;
        this.completionRate = completionRate;
        this.totalCancellations = totalCancellations;
        this.totalNoShows = totalNoShows;
        this.totalModifications = totalModifications;
        this.totalCompletedBookings = totalCompletedBookings;
    }

    // Getters and Setters
    public Double getCancellationRate() {
        return cancellationRate;
    }

    public void setCancellationRate(Double cancellationRate) {
        this.cancellationRate = cancellationRate;
    }

    public Double getNoShowRate() {
        return noShowRate;
    }

    public void setNoShowRate(Double noShowRate) {
        this.noShowRate = noShowRate;
    }

    public Double getModificationRate() {
        return modificationRate;
    }

    public void setModificationRate(Double modificationRate) {
        this.modificationRate = modificationRate;
    }

    public Double getAvgBookingLeadTime() {
        return avgBookingLeadTime;
    }

    public void setAvgBookingLeadTime(Double avgBookingLeadTime) {
        this.avgBookingLeadTime = avgBookingLeadTime;
    }

    public Double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(Double completionRate) {
        this.completionRate = completionRate;
    }

    public Integer getTotalCancellations() {
        return totalCancellations;
    }

    public void setTotalCancellations(Integer totalCancellations) {
        this.totalCancellations = totalCancellations;
    }

    public Integer getTotalNoShows() {
        return totalNoShows;
    }

    public void setTotalNoShows(Integer totalNoShows) {
        this.totalNoShows = totalNoShows;
    }

    public Integer getTotalModifications() {
        return totalModifications;
    }

    public void setTotalModifications(Integer totalModifications) {
        this.totalModifications = totalModifications;
    }

    public Integer getTotalCompletedBookings() {
        return totalCompletedBookings;
    }

    public void setTotalCompletedBookings(Integer totalCompletedBookings) {
        this.totalCompletedBookings = totalCompletedBookings;
    }
}
