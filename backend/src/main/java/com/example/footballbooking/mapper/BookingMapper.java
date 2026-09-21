package com.example.footballbooking.mapper;

import com.example.footballbooking.dto.response.BookingResponseDto;
import com.example.footballbooking.dto.response.FieldImageDto;
import com.example.footballbooking.entity.Booking;

// Chuyển đổi dữ liệu Booking sang DTO an toàn
public class BookingMapper {

    public static BookingResponseDto toDto(Booking booking) {
        if (booking == null) {
            return null;
        }

        String fieldImage = null;
        if (booking.getField() != null && booking.getField().getImages() != null && !booking.getField().getImages().isEmpty()) {
            fieldImage = booking.getField().getImages().get(0).getImageUrl();
        }

        return BookingResponseDto.builder()
                .id(booking.getId())
                .bookingCode(booking.getBookingCode())
                .userId(booking.getUser() != null ? booking.getUser().getId() : null)
                .userEmail(booking.getUser() != null ? booking.getUser().getEmail() : "")
                .userName(booking.getUser() != null ? booking.getUser().getFullName() : "")
                .userPhone(booking.getUser() != null ? booking.getUser().getPhone() : "")
                .fieldId(booking.getField() != null ? booking.getField().getId() : null)
                .fieldName(booking.getField() != null ? booking.getField().getName() : "")
                .fieldAddress(booking.getField() != null ? booking.getField().getAddress() : "")
                .fieldDistrict(booking.getField() != null ? booking.getField().getDistrict() : "")
                .fieldCity(booking.getField() != null ? booking.getField().getCity() : "")
                .fieldImage(fieldImage)
                .bookingDate(booking.getBookingDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus())
                .customerName(booking.getCustomerName())
                .customerPhone(booking.getCustomerPhone())
                .note(booking.getNote())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
