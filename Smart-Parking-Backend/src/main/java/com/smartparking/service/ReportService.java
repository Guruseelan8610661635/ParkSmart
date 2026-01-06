package com.smartparking.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartparking.dto.ReportResponse;
import com.smartparking.model.Booking;
import com.smartparking.repository.BookingRepository;
import com.smartparking.repository.SlotRepository;

@Service
public class ReportService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SlotRepository slotRepository;

    public ReportResponse generateReport(LocalDateTime startDate, LocalDateTime endDate, String reportType) {
        List<Booking> bookings = bookingRepository.findBookingsByDateRange(startDate, endDate);
        
        long totalBookings = bookings.size();
        long completedBookings = bookings.stream()
                .filter(b -> b.getStatus() == Booking.ParkingStatus.COMPLETED).count();
        long activeBookings = bookings.stream()
                .filter(b -> b.getStatus() == Booking.ParkingStatus.ACTIVE).count();
        long cancelledBookings = bookings.stream()
                .filter(b -> b.getStatus() == Booking.ParkingStatus.CANCELLED).count();
        
        double totalRevenue = bookings.stream()
                .filter(b -> b.getParkingFee() != null && b.getStatus() == Booking.ParkingStatus.COMPLETED)
                .mapToDouble(Booking::getParkingFee)
                .sum();
        
        double averageFee = completedBookings > 0 ? totalRevenue / completedBookings : 0;
        
        long totalSlots = slotRepository.count();
        long availableSlots = slotRepository.findAll().stream()
                .filter(slot -> slot.isAvailable() && !slot.isDisabled())
                .count();
        long disabledSlots = slotRepository.findAll().stream()
                .filter(slot -> slot.isDisabled())
                .count();
        long occupiedSlots = totalSlots - availableSlots - disabledSlots;
        
        int occupancyRate = totalSlots > 0 ? Math.toIntExact(occupiedSlots * 100 / totalSlots) : 0;

        ReportResponse report = new ReportResponse();
        report.setReportType(reportType);
        report.setGeneratedDate(LocalDateTime.now());
        report.setStartDate(startDate);
        report.setEndDate(endDate);
        report.setTotalBookings(totalBookings);
        report.setCompletedBookings(completedBookings);
        report.setActiveBookings(activeBookings);
        report.setCancelledBookings(cancelledBookings);
        report.setTotalRevenue(totalRevenue);
        report.setAverageFee(averageFee);
        report.setOccupancyRate(occupancyRate);
        report.setTotalSlots(totalSlots);
        report.setAvailableSlots(availableSlots);
        
        return report;
    }

    public ReportResponse generateDailyReport() {
        LocalDateTime startDate = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endDate = LocalDateTime.now();
        return generateReport(startDate, endDate, "DAILY");
    }

    public ReportResponse generateWeeklyReport() {
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(7);
        return generateReport(startDate, endDate, "WEEKLY");
    }

    public ReportResponse generateMonthlyReport() {
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusMonths(1);
        return generateReport(startDate, endDate, "MONTHLY");
    }
}
