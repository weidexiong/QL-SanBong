package com.example.footballbooking.entity;

// Trạng thái của đơn đặt sân
public enum BookingStatus {
    PENDING,    // Chờ chủ sân xác nhận / chờ thanh toán
    CONFIRMED,  // Đã xác nhận thành công (khung giờ được bảo đảm giữ sân)
    CANCELLED,  // Người dùng hoặc hệ thống đã hủy đơn
    REJECTED,   // Chủ sân từ chối đơn
    COMPLETED   // Trận đấu đã diễn ra thành công (đủ điều kiện đánh giá review)
}
