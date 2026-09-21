package com.example.footballbooking.dto.response;

import com.example.footballbooking.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

// DTO chi tiết đơn đặt sân bóng trả về cho khách hàng và chủ sân
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDto {
    private Long id;
    private String bookingCode;
    private Long userId;
    private String userEmail;
    private String userName;
    private String userPhone;
    private Long fieldId;
    private String fieldName;
    private String fieldAddress;
    private String fieldDistrict;
    private String fieldCity;
    private String fieldImage;
    private LocalDate bookingDate;
    private String startTime;
    private String endTime;
    private Long totalPrice;
    private BookingStatus status;
    private String customerName;
    private String customerPhone;
    private String note;
    private LocalDateTime createdAt;
}
