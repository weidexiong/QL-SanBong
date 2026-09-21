package com.example.footballbooking.controller;

import com.example.footballbooking.dto.response.ApiResponse;
import com.example.footballbooking.dto.response.TimeSlotDto;
import com.example.footballbooking.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

// Controller kiểm tra khung giờ trống của sân bóng
@RestController
@RequestMapping("/api/v1/fields/{fieldId}/availability")
@RequiredArgsConstructor
@Tag(name = "Field Availability", description = "Các API kiểm tra lịch trống và trạng thái khung giờ theo ngày")
public class AvailabilityController {

    private final ScheduleService scheduleService;

    @GetMapping
    @Operation(summary = "Kiểm tra khung giờ trống theo ngày", description = "Trả về danh sách khung giờ cùng trạng thái AVAILABLE, BOOKED hoặc BLOCKED cho ngày đã chọn")
    public ResponseEntity<ApiResponse<List<TimeSlotDto>>> getAvailability(
            @PathVariable Long fieldId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        LocalDate queryDate = (date != null) ? date : LocalDate.now();
        List<TimeSlotDto> slots = scheduleService.getAvailability(fieldId, queryDate);
        return ResponseEntity.ok(ApiResponse.ok(slots));
    }
}
