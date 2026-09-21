package com.example.footballbooking.controller;

import com.example.footballbooking.dto.response.ApiResponse;
import com.example.footballbooking.dto.response.BookingResponseDto;
import com.example.footballbooking.dto.response.PageResponseDto;
import com.example.footballbooking.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

// Controller dành riêng cho Chủ sân (ROLE_CHUSAN) quản lý yêu cầu và lịch đặt sân
@RestController
@RequestMapping("/api/v1/owner/bookings")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_CHUSAN')")
@Tag(name = "Owner Bookings", description = "Các API xác nhận, từ chối và quản lý lịch đặt sân của Chủ sân")
public class OwnerBookingController {

    private final BookingService bookingService;

    @GetMapping
    @Operation(summary = "Danh sách đơn đặt sân của chủ sân", description = "Lấy tất cả các yêu cầu đặt sân thuộc cụm sân của chủ sân")
    public ResponseEntity<ApiResponse<PageResponseDto<BookingResponseDto>>> getOwnerBookings(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponseDto<BookingResponseDto> response = bookingService.getOwnerBookings(userDetails.getUsername(), page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/calendar")
    @Operation(summary = "Lịch đặt sân theo ngày", description = "Lấy danh sách các trận đấu trong ngày phục vụ hiển thị trên Calendar")
    public ResponseEntity<ApiResponse<List<BookingResponseDto>>> getOwnerBookingsByDate(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<BookingResponseDto> list = bookingService.getOwnerBookingsByDate(userDetails.getUsername(), date);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PutMapping("/{id}/confirm")
    @Operation(summary = "Xác nhận đơn đặt sân", description = "Chủ sân phê duyệt đơn đặt sân sang trạng thái CONFIRMED")
    public ResponseEntity<ApiResponse<BookingResponseDto>> confirmBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        BookingResponseDto booking = bookingService.confirmBookingByOwner(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.ok("Đã xác nhận lịch đặt sân thành công", booking));
    }

    @PutMapping("/{id}/reject")
    @Operation(summary = "Từ chối đơn đặt sân", description = "Chủ sân từ chối đơn đặt sân")
    public ResponseEntity<ApiResponse<BookingResponseDto>> rejectBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        BookingResponseDto booking = bookingService.rejectBookingByOwner(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.ok("Đã từ chối đơn đặt sân này", booking));
    }

    @PutMapping("/{id}/complete")
    @Operation(summary = "Hoàn thành trận đấu", description = "Đánh dấu trận đấu đã diễn ra thành công để ghi nhận doanh thu")
    public ResponseEntity<ApiResponse<BookingResponseDto>> completeBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        BookingResponseDto booking = bookingService.completeBookingByOwner(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.ok("Đã đánh dấu hoàn thành trận đấu", booking));
    }
}
