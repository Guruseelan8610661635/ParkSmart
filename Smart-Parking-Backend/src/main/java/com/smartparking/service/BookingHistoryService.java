package com.smartparking.service;

import java.time.LocalDateTime;
import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.smartparking.dto.BookingDetailDto;
import com.smartparking.dto.BookingHistoryResponse;
import com.smartparking.model.Booking;
import com.smartparking.model.Slot;
import com.smartparking.repository.BookingRepository;
import com.smartparking.repository.SlotRepository;

@Service
public class BookingHistoryService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SlotRepository slotRepository;

    public BookingHistoryResponse getCurrentBookings(Long userId, Integer pageNumber, Integer pageSize) {
        long startTime = System.currentTimeMillis();

        List<Booking> bookings = bookingRepository.findCurrentBookingsByUserId(userId);
        long totalRecords = bookingRepository.countCurrentBookingsByUserId(userId);

        List<BookingDetailDto> bookingDtos = convertToDetailDto(bookings);

        BookingHistoryResponse response = buildResponse(bookingDtos, totalRecords, pageNumber, pageSize);
        response.setCurrentActiveBookings((long) bookingDtos.size());
        response.setCompletedBookings(bookingRepository.countCompletedBookings());
        response.setCancelledBookings(bookingRepository.countCancelledBookings());
        response.setFetchTimeMs(System.currentTimeMillis() - startTime);

        return response;
    }

    public BookingHistoryResponse getPastBookings(Long userId, Integer pageNumber, Integer pageSize) {
        long startTime = System.currentTimeMillis();

        List<Booking> bookings = bookingRepository.findPastBookingsByUserId(userId);
        long totalRecords = bookingRepository.countPastBookingsByUserId(userId);

        List<BookingDetailDto> bookingDtos = convertToDetailDto(bookings);

        BookingHistoryResponse response = buildResponse(bookingDtos, totalRecords, pageNumber, pageSize);
        response.setCompletedBookings(bookingRepository.countCompletedBookings());
        response.setCancelledBookings(bookingRepository.countCancelledBookings());
        response.setFetchTimeMs(System.currentTimeMillis() - startTime);

        return response;
    }

    public BookingHistoryResponse getAllBookings(Long userId, Integer pageNumber, Integer pageSize) {
        long startTime = System.currentTimeMillis();

        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        List<Booking> bookings = bookingRepository.findBookingsByUserIdPaginated(userId, pageable);
        long totalRecords = bookingRepository.findByUserId(userId).size();

        List<BookingDetailDto> bookingDtos = convertToDetailDto(bookings);

        BookingHistoryResponse response = buildResponse(bookingDtos, totalRecords, pageNumber, pageSize);
        response.setCurrentActiveBookings(bookingRepository.countCurrentBookingsByUserId(userId));
        response.setCompletedBookings(bookingRepository.countCompletedBookings());
        response.setCancelledBookings(bookingRepository.countCancelledBookings());
        response.setFetchTimeMs(System.currentTimeMillis() - startTime);

        return response;
    }

    public BookingHistoryResponse getBookingsByFilter(Long userId, String filterType, LocalDateTime startDate, LocalDateTime endDate, Integer pageNumber, Integer pageSize) {
        long startTime = System.currentTimeMillis();

        List<Booking> bookings = null;

        if ("CURRENT".equalsIgnoreCase(filterType)) {
            bookings = bookingRepository.findCurrentBookingsByUserId(userId);
        } else if ("PAST".equalsIgnoreCase(filterType)) {
            bookings = bookingRepository.findPastBookingsByUserId(userId);
        } else if ("ACTIVE".equalsIgnoreCase(filterType)) {
            bookings = bookingRepository.findByUserId(userId).stream()
                    .filter(b -> b.getStatus() == Booking.ParkingStatus.ACTIVE)
                    .collect(Collectors.toList());
        } else if ("COMPLETED".equalsIgnoreCase(filterType)) {
            bookings = bookingRepository.findByUserId(userId).stream()
                    .filter(b -> b.getStatus() == Booking.ParkingStatus.COMPLETED)
                    .collect(Collectors.toList());
        } else {
            bookings = bookingRepository.findByUserId(userId);
        }

        if (startDate != null && endDate != null) {
            bookings = bookings.stream()
                    .filter(b -> b.getEntryTime().isAfter(startDate) && b.getEntryTime().isBefore(endDate))
                    .collect(Collectors.toList());
        }

        List<BookingDetailDto> bookingDtos = convertToDetailDto(bookings);
        long totalRecords = bookingDtos.size();

        BookingHistoryResponse response = buildResponse(bookingDtos, totalRecords, pageNumber, pageSize);
        response.setFetchTimeMs(System.currentTimeMillis() - startTime);

        return response;
    }

    public BookingDetailDto getBookingDetail(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        return convertToDetailDto(booking);
    }

    public List<BookingDetailDto> getQuickBookingList(Long userId, int limit) {
        List<Booking> bookings = bookingRepository.findByUserId(userId).stream()
                .limit(limit)
                .collect(Collectors.toList());

        return convertToDetailDto(bookings);
    }

    private List<BookingDetailDto> convertToDetailDto(List<Booking> bookings) {
        return bookings.stream()
                .map(this::convertToDetailDto)
                .collect(Collectors.toList());
    }

    private BookingDetailDto convertToDetailDto(Booking booking) {
        Slot slot = slotRepository.findById(booking.getSlotId()).orElse(null);

        BookingDetailDto dto = new BookingDetailDto(
                booking.getId(),
                booking.getSlotId(),
                slot != null ? slot.getSlotNumber() : "N/A",
                slot != null ? slot.getLocation().getId() : null,
                slot != null ? slot.getLocation().getName() : "N/A"
        );

        dto.setVehicleType(booking.getVehicleType() != null ? booking.getVehicleType().name() : "CAR");
        dto.setEntryTime(booking.getEntryTime());
        dto.setExitTime(booking.getExitTime());
        dto.setStatus(booking.getStatus() != null ? booking.getStatus().toString() : "ACTIVE");
        dto.setParkingFee(booking.getParkingFee());
        dto.setTransactionId(booking.getTransactionId());
        dto.setPaymentStatus(booking.getPaymentStatus());
        dto.setPaymentTime(booking.getPaymentTime());
        dto.setIsActive(booking.getExitTime() == null);

        if (booking.getEntryTime() != null && booking.getExitTime() != null) {
            Duration duration = Duration.between(booking.getEntryTime(), booking.getExitTime());
            dto.setDurationMinutes(duration.toMinutes());
            dto.setFormattedDuration(formatDuration(duration));
        } else if (booking.getEntryTime() != null) {
            Duration duration = Duration.between(booking.getEntryTime(), LocalDateTime.now());
            dto.setDurationMinutes(duration.toMinutes());
            dto.setFormattedDuration(formatDuration(duration));
        }

        return dto;
    }

    private String formatDuration(Duration duration) {
        long hours = duration.toHours();
        long minutes = duration.toMinutes() % 60;
        return hours + "h " + minutes + "m";
    }

    private BookingHistoryResponse buildResponse(List<BookingDetailDto> bookingDtos, long totalRecords, Integer pageNumber, Integer pageSize) {
        BookingHistoryResponse response = new BookingHistoryResponse();
        response.setBookings(bookingDtos);
        response.setTotalRecords(totalRecords);
        response.setPageNumber(pageNumber);
        response.setPageSize(pageSize);
        response.setTotalPages((int) Math.ceil((double) totalRecords / pageSize));
        response.setHasNextPage((long) (pageNumber + 1) * pageSize < totalRecords);

        return response;
    }
}
