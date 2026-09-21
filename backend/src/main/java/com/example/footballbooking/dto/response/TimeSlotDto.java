package com.example.footballbooking.dto.response;

import com.example.footballbooking.entity.SlotStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO biểu diễn trạng thái của một khung giờ trong ngày
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlotDto {
    private Long id;
    private String startTime;
    private String endTime;
    private Long price;
    private SlotStatus status;
}
