package com.example.footballbooking.controller;

import com.example.footballbooking.dto.response.ApiResponse;
import com.example.footballbooking.dto.response.NotificationDto;
import com.example.footballbooking.dto.response.PageResponseDto;
import com.example.footballbooking.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

// Controller trung tâm thông báo người dùng
@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Các API nhận thông báo đặt sân, xác nhận, hủy và thanh toán")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Lấy danh sách thông báo", description = "Trả về danh sách thông báo của tài khoản đang đăng nhập")
    public ResponseEntity<ApiResponse<PageResponseDto<NotificationDto>>> getMyNotifications(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        PageResponseDto<NotificationDto> response = notificationService.getUserNotifications(userDetails.getUsername(), page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Đánh dấu đã đọc thông báo", description = "Chuyển trạng thái thông báo sang đã đọc")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        notificationService.markAsRead(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.ok("Đã đánh dấu đã đọc", null));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Số lượng thông báo chưa đọc", description = "Đếm số thông báo mới chưa đọc hiển thị trên chuông thông báo")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@AuthenticationPrincipal UserDetails userDetails) {
        long count = notificationService.getUnreadCount(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(count));
    }
}
