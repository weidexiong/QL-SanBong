package com.example.footballbooking.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO cấu hình hoặc cập nhật khung giờ từ phía chủ sân
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlotManageRequest {

    @NotBlank(message = "Giờ bắt đầu không được để trống")
    private String startTime;

    @NotBlank(message = "Giờ kết thúc không được để trống")
    private String endTime;

    @NotNull(message = "Giá thuê không được để trống")
    @Min(value = 10000, message = "Giá tối thiểu là 10.000 VNĐ")
    private Long price;

    @Builder.Default
    private boolean isActive = true;
}
