package com.example.footballbooking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

// DTO thống kê số liệu Dashboard cho Quản trị viên (Requirement 52)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDto {
    private long totalUsers;
    private long totalOwners;
    private long totalFields;
    private long totalBookings;
    private BigDecimal totalRevenue;
    private long pendingFields;
    private long pendingOwners;
}
