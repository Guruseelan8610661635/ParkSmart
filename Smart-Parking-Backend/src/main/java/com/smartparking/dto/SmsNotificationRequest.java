package com.smartparking.dto;

public class SmsNotificationRequest {
    private String phoneNumber;
    private String message;
    private String type; // BOOKING_CONFIRMATION, PAYMENT_ALERT, REMINDER

    public SmsNotificationRequest() {}

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
