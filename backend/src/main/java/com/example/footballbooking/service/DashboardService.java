package com.example.footballbooking.service;

import com.example.footballbooking.dto.response.AdminDashboardDto;
import com.example.footballbooking.dto.response.OwnerDashboardDto;
import com.example.footballbooking.entity.BookingStatus;
import com.example.footballbooking.entity.FieldStatus;
import com.example.footballbooking.entity.User;
import com.example.footballbooking.entity.UserRole;
import com.example.footballbooking.entity.UserStatus;
import com.example.footballbooking.exception.ResourceNotFoundException;
import com.example.footballbooking.repository.BookingRepository;
import com.example.footballbooking.repository.FootballFieldRepository;
import com.example.footballbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;

// Dịch vụ tổng hợp số liệu thống kê báo cáo Dashboard cho Chủ sân và Admin
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final FootballFieldRepository fieldRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    private static final ZoneId VN_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    // Thống kê số liệu cho Chủ sân (Requirement 52)
    @Transactional(readOnly = true)
    public OwnerDashboardDto getOwnerStats(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chủ sân"));

        LocalDate today = LocalDate.now(VN_ZONE);
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfMonth = today.withDayOfMonth(today.lengthOfMonth());

        long totalFields = fieldRepository.countByOwnerId(owner.getId());
        long todayBookings = bookingRepository.countByOwnerIdAndDate(owner.getId(), today);
        Long todayRev = bookingRepository.calculateTodayRevenueByOwner(owner.getId(), today);
        Long monthRev = bookingRepository.calculateMonthRevenueByOwner(owner.getId(), startOfMonth, endOfMonth);
        long pendingBookings = bookingRepository.countByOwnerIdAndStatus(owner.getId(), BookingStatus.PENDING);

        return OwnerDashboardDto.builder()
                .totalFields(totalFields)
                .todayBookings(todayBookings)
                .todayRevenue(BigDecimal.valueOf(todayRev != null ? todayRev : 0L))
                .monthRevenue(BigDecimal.valueOf(monthRev != null ? monthRev : 0L))
                .pendingBookings(pendingBookings)
                .build();
    }

    // Thống kê số liệu cho Quản trị viên Admin (Requirement 52)
    @Transactional(readOnly = true)
    public AdminDashboardDto getAdminStats() {
        long totalUsers = userRepository.countByRole(UserRole.ROLE_USER);
        long totalOwners = userRepository.countByRole(UserRole.ROLE_CHUSAN);
        long totalFields = fieldRepository.count();
        long totalBookings = bookingRepository.count();
        Long systemRev = bookingRepository.calculateTotalSystemRevenue();
        long pendingFields = fieldRepository.countByStatus(FieldStatus.PENDING_APPROVAL);
        long pendingOwners = userRepository.countByRoleAndStatus(UserRole.ROLE_CHUSAN, UserStatus.PENDING);

        return AdminDashboardDto.builder()
                .totalUsers(totalUsers)
                .totalOwners(totalOwners)
                .totalFields(totalFields)
                .totalBookings(totalBookings)
                .totalRevenue(BigDecimal.valueOf(systemRev != null ? systemRev : 0L))
                .pendingFields(pendingFields)
                .pendingOwners(pendingOwners)
                .build();
    }
}
