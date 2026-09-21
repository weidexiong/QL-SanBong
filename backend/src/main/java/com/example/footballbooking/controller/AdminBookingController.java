package com.example.footballbooking.controller;

import com.example.footballbooking.dto.response.ApiResponse;
import com.example.footballbooking.dto.response.BookingResponseDto;
import com.example.footballbooking.dto.response.PageResponseDto;
import com.example.footballbooking.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

// Controller dành riêng cho Quản trị viên (ROLE_ADMIN) quản lý tất cả đơn đặt sân
@RestController
@RequestMapping("/api/v1/admin/bookings")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Tag(name = "Admin Bookings", description = "Các API kiểm tra và quản lý đơn đặt sân toàn sàn")
public class AdminBookingController {

    private final BookingService bookingService;

    @GetMapping
    @Operation(summary = "Xem toàn bộ đơn đặt sân hệ thống", description = "Admin theo dõi danh sách tất cả các đơn đặt sân kèm phân trang")
    public ResponseEntity<ApiResponse<PageResponseDto<BookingResponseDto>>> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponseDto<BookingResponseDto> response = bookingService.getAllBookingsForAdmin(page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
