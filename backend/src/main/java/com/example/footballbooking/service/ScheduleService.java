package com.example.footballbooking.service;

import com.example.footballbooking.dto.response.TimeSlotDto;
import com.example.footballbooking.entity.*;
import com.example.footballbooking.exception.ResourceNotFoundException;
import com.example.footballbooking.repository.BookingRepository;
import com.example.footballbooking.repository.FieldTimeSlotRepository;
import com.example.footballbooking.repository.FootballFieldRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

// Dịch vụ quản lý khung giờ và kiểm tra lịch trống của sân bóng
@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final FootballFieldRepository fieldRepository;
    private final FieldTimeSlotRepository slotRepository;
    private final BookingRepository bookingRepository;

    // Danh sách khung giờ chuẩn mặc định của bóng đá Việt Nam nếu sân chưa thiết lập biểu giá riêng
    private static final String[][] DEFAULT_SLOTS = {
            {"06:00", "07:30"},
            {"07:30", "09:00"},
            {"09:00", "10:30"},
            {"14:30", "16:00"},
            {"16:00", "17:30"},
            {"17:30", "19:00"},
            {"19:00", "20:30"},
            {"20:30", "22:00"}
    };

    // Kiểm tra tính khả dụng của các khung giờ trong ngày chỉ định
    @Transactional(readOnly = true)
    public List<TimeSlotDto> getAvailability(Long fieldId, LocalDate date) {
        FootballField field = fieldRepository.findById(fieldId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sân bóng"));

        // Lấy danh sách booking đã giữ chỗ (PENDING hoặc CONFIRMED) trong ngày
        List<Booking> bookedList = bookingRepository.findByFieldIdAndBookingDateAndStatusIn(
                fieldId, date, Arrays.asList(BookingStatus.PENDING, BookingStatus.CONFIRMED)
        );

        Set<String> bookedStartTimes = bookedList.stream()
                .map(Booking::getStartTime)
                .collect(Collectors.toSet());

        // Lấy các khung giờ được chủ sân tùy chỉnh trong cơ sở dữ liệu
        List<FieldTimeSlot> customSlots = slotRepository.findByFieldIdAndIsActiveTrueOrderByStartTimeAsc(fieldId);

        List<TimeSlotDto> result = new ArrayList<>();

        if (!customSlots.isEmpty()) {
            for (FieldTimeSlot slot : customSlots) {
                boolean isBooked = bookedStartTimes.contains(slot.getStartTime());
                result.add(TimeSlotDto.builder()
                        .id(slot.getId())
                        .startTime(slot.getStartTime())
                        .endTime(slot.getEndTime())
                        .price(slot.getPrice())
                        .status(isBooked ? SlotStatus.BOOKED : SlotStatus.AVAILABLE)
                        .build());
            }
        } else {
            // Sử dụng các khung giờ mặc định dựa trên basePrice của sân
            long idCounter = 1;
            for (String[] pair : DEFAULT_SLOTS) {
                String start = pair[0];
                String end = pair[1];
                boolean isBooked = bookedStartTimes.contains(start);

                // Khung giờ vàng (17:30 - 20:30) phụ thu 20%
                long slotPrice = field.getBasePrice();
                if (start.equals("17:30") || start.equals("19:00")) {
                    slotPrice = Math.round(slotPrice * 1.2 / 10000) * 10000;
                }

                result.add(TimeSlotDto.builder()
                        .id(idCounter++)
                        .startTime(start)
                        .endTime(end)
                        .price(slotPrice)
                        .status(isBooked ? SlotStatus.BOOKED : SlotStatus.AVAILABLE)
                        .build());
            }
        }

        return result;
    }
}
