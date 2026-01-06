package com.smartparking.service;

import org.springframework.stereotype.Service;

@Service
public class SmsService {

    public Boolean sendSms(String phoneNumber, String message) {
        try {
            if (phoneNumber == null || phoneNumber.isEmpty()) {
                return false;
            }
            
            System.out.println("SMS Sent to: " + phoneNumber);
            System.out.println("Message: " + message);
            
            return true;
        } catch (Exception e) {
            System.out.println("Failed to send SMS: " + e.getMessage());
            return false;
        }
    }

    public Boolean sendBookingConfirmationSms(String phoneNumber, Long bookingId, String slotNumber) {
        String message = "Your parking booking is confirmed. Booking ID: " + bookingId + 
                        ", Slot: " + slotNumber + ". Thank you!";
        return sendSms(phoneNumber, message);
    }

    public Boolean sendPaymentAlertSms(String phoneNumber, Double amount) {
        String message = "Payment of $" + amount + " has been received. Thank you for using Smart Parking!";
        return sendSms(phoneNumber, message);
    }

    public Boolean sendParkingReminderSms(String phoneNumber, String duration) {
        String message = "Your parking session will end in " + duration + ". Please plan accordingly.";
        return sendSms(phoneNumber, message);
    }
}
