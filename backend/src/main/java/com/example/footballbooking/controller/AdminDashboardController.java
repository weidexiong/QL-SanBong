package com.example.footballbooking.controller;

import com.example.footballbooking.dto.response.AdminDashboardDto;
import com.example.footballbooking.dto.response.ApiResponse;
import com.example.footballbooking.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Controller thống kê báo cáo tổng quan toàn hệ thống cho Quản trị viên (ROLE_ADMIN)
@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Tag(name = "Admin Dashboard", description = "Các API thống kê chỉ số quy mô và tài chính toàn hệ thống cho Quản trị viên")
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @Operation(summary = "Thống kê tổng quan Quản trị viên", description = "Lấy tổng số user, chủ sân, số sân, số booking, doanh thu toàn sàn và số lượng chờ duyệt")
    public ResponseEntity<ApiResponse<AdminDashboardDto>> getAdminStats() {
        AdminDashboardDto stats = dashboardService.getAdminStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
