package com.example.footballbooking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

// DTO thống kê số liệu Dashboard cho Chủ sân (Requirement 52)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OwnerDashboardDto {
    private long totalFields;
    private long todayBookings;
    private BigDecimal todayRevenue;
    private BigDecimal monthRevenue;
    private long pendingBookings;
}
