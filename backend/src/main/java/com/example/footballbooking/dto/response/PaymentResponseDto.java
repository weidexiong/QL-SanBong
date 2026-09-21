package com.example.footballbooking.dto.response;

import com.example.footballbooking.entity.PaymentMethod;
import com.example.footballbooking.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// DTO thông tin giao dịch thanh toán trả về
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDto {
    private Long id;
    private Long bookingId;
    private String bookingCode;
    private Long amount;
    private PaymentMethod paymentMethod;
    private String paymentMethodDisplayName;
    private PaymentStatus status;
    private String transactionCode;
    private String qrCodeData;
    private LocalDateTime paymentTime;
}
