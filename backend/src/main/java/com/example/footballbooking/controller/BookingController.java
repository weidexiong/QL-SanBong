package com.example.footballbooking.controller;

import com.example.footballbooking.dto.request.BookingCreateRequest;
import com.example.footballbooking.dto.response.ApiResponse;
import com.example.footballbooking.dto.response.BookingResponseDto;
import com.example.footballbooking.dto.response.PageResponseDto;
import com.example.footballbooking.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

// Controller tiếp nhận các thao tác đặt sân của khách hàng
@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Các API đặt sân và quản lý lịch sử đặt của khách hàng")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @Operation(summary = "Tạo đơn đặt sân mới", description = "Khách hàng đặt khung giờ sân bóng, hệ thống kiểm tra double-booking và tự động tính giá")
    public ResponseEntity<ApiResponse<BookingResponseDto>> createBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody BookingCreateRequest request
    ) {
        BookingResponseDto booking = bookingService.createBooking(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Đặt sân thành công! Vui lòng hoàn tất thanh toán", booking));
    }

    @GetMapping
    @Operation(summary = "Lịch sử đặt sân của tôi", description = "Lấy danh sách các đơn đặt sân của khách hàng đang đăng nhập kèm phân trang")
    public ResponseEntity<ApiResponse<PageResponseDto<BookingResponseDto>>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponseDto<BookingResponseDto> response = bookingService.getMyBookings(userDetails.getUsername(), page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết đơn đặt sân", description = "Lấy thông tin chi tiết một đơn đặt sân theo ID")
    public ResponseEntity<ApiResponse<BookingResponseDto>> getBookingDetail(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        BookingResponseDto booking = bookingService.getBookingDetail(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.ok(booking));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Hủy đơn đặt sân", description = "Khách hàng hủy đơn đặt sân trước giờ thi đấu")
    public ResponseEntity<ApiResponse<BookingResponseDto>> cancelBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        BookingResponseDto booking = bookingService.cancelBookingByUser(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.ok("Đã hủy lịch đặt sân thành công", booking));
    }
}
