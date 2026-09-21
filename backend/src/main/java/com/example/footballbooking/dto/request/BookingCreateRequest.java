package com.example.footballbooking.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

// DTO yêu cầu đặt lịch sân bóng từ khách hàng
// Lưu ý: Không bao gồm giá tiền hoặc tổng tiền (Backend tự tính toán theo quy định bảo mật)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingCreateRequest {

    @NotNull(message = "Mã sân bóng không được để trống")
    private Long fieldId;

    @NotNull(message = "Ngày đặt sân không được để trống")
    @FutureOrPresent(message = "Ngày đặt sân phải từ hôm nay trở đi")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate bookingDate;

    @NotBlank(message = "Khung giờ bắt đầu không được để trống")
    private String startTime;

    @NotBlank(message = "Khung giờ kết thúc không được để trống")
    private String endTime;

    private String customerName;
    private String customerPhone;
    private String note;
}
