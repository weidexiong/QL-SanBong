package com.example.footballbooking.controller;

import com.example.footballbooking.dto.response.ApiResponse;
import com.example.footballbooking.dto.response.OwnerDashboardDto;
import com.example.footballbooking.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Controller thống kê báo cáo doanh thu và đơn hàng cho Chủ sân (ROLE_CHUSAN)
@RestController
@RequestMapping("/api/v1/owner/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_CHUSAN')")
@Tag(name = "Owner Dashboard", description = "Các API thống kê chỉ số hoạt động kinh doanh của Chủ sân")
public class OwnerDashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @Operation(summary = "Thống kê tổng quan Chủ sân", description = "Lấy tổng số sân, lượt đặt hôm nay, doanh thu hôm nay và doanh thu tháng")
    public ResponseEntity<ApiResponse<OwnerDashboardDto>> getOwnerStats(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        OwnerDashboardDto stats = dashboardService.getOwnerStats(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
