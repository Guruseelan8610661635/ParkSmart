package com.smartparking.service;

import java.time.LocalDateTime;
import java.time.Duration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartparking.dto.BookingStatusDto;
import com.smartparking.model.Booking;
import com.smartparking.model.Slot;
import com.smartparking.repository.BookingRepository;
import com.smartparking.repository.SlotRepository;
import com.smartparking.repository.VehiclePricingRepository;

@Service
public class BookingStatusService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private VehiclePricingRepository vehiclePricingRepository;

    public BookingStatusDto getBookingStatus(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Slot slot = slotRepository.findById(booking.getSlotId()).orElse(null);

        BookingStatusDto dto = new BookingStatusDto();
        dto.setBookingId(bookingId);
        dto.setStatus(booking.getStatus() != null ? booking.getStatus().toString() : "ACTIVE");
        dto.setLastUpdated(booking.getExitTime() != null ? booking.getExitTime() : booking.getEntryTime());
        dto.setCurrentSlot(slot != null ? slot.getSlotNumber() : "N/A");
        dto.setCurrentLocation(slot != null ? slot.getLocation().getName() : "N/A");

        if (booking.getEntryTime() != null) {
            LocalDateTime exitTime = booking.getExitTime() != null ? booking.getExitTime() : LocalDateTime.now();
            Duration duration = Duration.between(booking.getEntryTime(), exitTime);
            dto.setDurationSoFarMinutes(duration.toMinutes());

            dto.setEstimatedFee(calculateEstimatedFee(booking, duration));
        }

        dto.setIsOvertime(booking.getExitTime() != null && booking.getParkingFee() != null);

        return dto;
    }

    public BookingStatusDto getQuickBookingStatus(Long bookingId) {
        long startTime = System.currentTimeMillis();
        BookingStatusDto status = getBookingStatus(bookingId);

        long fetchTime = System.currentTimeMillis() - startTime;
        System.out.println("Fetch time: " + fetchTime + "ms");

        return status;
    }

    private Double calculateEstimatedFee(Booking booking, Duration duration) {
        try {
            String vehicleType = booking.getVehicleType() != null ? 
                                 booking.getVehicleType().name() : "CAR";

            Double hourlyRate = vehiclePricingRepository.findByVehicleType(vehicleType)
                    .map(vp -> vp.getHourlyRate())
                    .orElse(5.0);

            long hours = duration.toHours();
            long minutes = duration.toMinutes() % 60;
            double fractionalHours = hours + (minutes / 60.0);

            return fractionalHours * hourlyRate;
        } catch (Exception e) {
            return 0.0;
        }
    }
}
