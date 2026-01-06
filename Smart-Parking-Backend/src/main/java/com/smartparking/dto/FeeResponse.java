package com.smartparking.dto;

/**
 * DEPRECATED: Fee response is now handled through CheckoutResponse.
 * Use CheckoutResponse when calling POST /api/bookings/{bookingId}/checkout
 */
@Deprecated
public class FeeResponse {
    private double fee;

    public FeeResponse(double fee) {
        this.fee = fee;
    }

    public double getFee() {
        return fee;
    }
}
