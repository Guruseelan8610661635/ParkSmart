package com.smartparking.dto;

/**
 * Checkout Response DTO
 * Contains the response after a vehicle exits the parking slot.
 * Includes parking duration, calculated fee, vehicle type, and payment status.
 */
public class CheckoutResponse {

    private Long bookingId;
    private Long slotId;
    private String vehicleType;            // Type of vehicle (BIKE, CAR, SUV, TRUCK)
    private Long durationMinutes;          // Time parked in minutes
    private Double ratePerHour;            // Rate applied for this vehicle type
    private Double parkingFee;             // Calculated fee
    private Boolean paymentSuccess;        // Payment status
    private String transactionId;          // Transaction ID if successful
    private String message;                // Success or error message

    public CheckoutResponse(
            Long bookingId,
            Long slotId,
            Long durationMinutes,
            Double parkingFee,
            Boolean paymentSuccess,
            String transactionId,
            String message
    ) {
        this.bookingId = bookingId;
        this.slotId = slotId;
        this.durationMinutes = durationMinutes;
        this.parkingFee = parkingFee;
        this.paymentSuccess = paymentSuccess;
        this.transactionId = transactionId;
        this.message = message;
    }

    // Constructor with vehicle type and rate
    public CheckoutResponse(
            Long bookingId,
            Long slotId,
            String vehicleType,
            Long durationMinutes,
            Double ratePerHour,
            Double parkingFee,
            Boolean paymentSuccess,
            String transactionId,
            String message
    ) {
        this.bookingId = bookingId;
        this.slotId = slotId;
        this.vehicleType = vehicleType;
        this.durationMinutes = durationMinutes;
        this.ratePerHour = ratePerHour;
        this.parkingFee = parkingFee;
        this.paymentSuccess = paymentSuccess;
        this.transactionId = transactionId;
        this.message = message;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public Long getSlotId() {
        return slotId;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public Long getDurationMinutes() {
        return durationMinutes;
    }

    public Double getRatePerHour() {
        return ratePerHour;
    }

    public void setRatePerHour(Double ratePerHour) {
        this.ratePerHour = ratePerHour;
    }

    public Double getParkingFee() {
        return parkingFee;
    }

    public Boolean getPaymentSuccess() {
        return paymentSuccess;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public String getMessage() {
        return message;
    }

    @Override
    public String toString() {
        return "CheckoutResponse{" +
                "bookingId=" + bookingId +
                ", slotId=" + slotId +
                ", durationMinutes=" + durationMinutes +
                ", parkingFee=" + parkingFee +
                ", paymentSuccess=" + paymentSuccess +
                ", transactionId='" + transactionId + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
}
