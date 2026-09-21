package com.example.footballbooking.entity;

// Trạng thái tài khoản người dùng
public enum UserStatus {
    ACTIVE,     // Đang hoạt động bình thường
    PENDING,    // Đang chờ Admin phê duyệt (dành cho chủ sân mới đăng ký)
    REJECTED,   // Bị Admin từ chối phê duyệt
    LOCKED      // Bị khóa do vi phạm chính sách
}
