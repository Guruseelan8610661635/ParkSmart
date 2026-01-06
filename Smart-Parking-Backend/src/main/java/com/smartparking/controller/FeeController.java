package com.smartparking.controller;

/**
 * DEPRECATED: Fee calculation is now integrated into the BookingService checkout flow.
 * Use POST /api/bookings/{bookingId}/checkout to calculate and process parking fees.
 *
 * The FeeCalculationService is still available for standalone fee calculations if needed,
 * but the primary fee calculation flow is handled in BookingService.checkoutBooking()
 */
@Deprecated
public class FeeController {
    // This controller has been deprecated.
    // Fee calculation logic is now integrated into the booking checkout endpoint.
    // See BookingController.checkoutBooking() for details.
}
