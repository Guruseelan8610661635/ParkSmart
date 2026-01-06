package com.smartparking.model;

/**
 * Booking Status Enum
 * Represents the different states of a parking booking
 */
public enum BookingStatus {
    ACTIVE,      // Booking is active - user is currently parked
    COMPLETED,   // Booking is completed - payment done
    CANCELLED    // Booking was cancelled
}
