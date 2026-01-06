package com.smartparking.dto;

import java.time.LocalDateTime;

/**
 * DEPRECATED: Fee calculation is now handled through CheckoutResponse.
 * Use CheckoutResponse when calling POST /api/bookings/{bookingId}/checkout
 */
@Deprecated
public class FeeRequest {
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
}
