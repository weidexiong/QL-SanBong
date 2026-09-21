package com.example.footballbooking.entity;

// Trạng thái của khung giờ trong ngày
public enum SlotStatus {
    AVAILABLE,  // Khung giờ còn trống, có thể đặt
    BOOKED,     // Đã có người đặt và xác nhận
    BLOCKED     // Sân tạm khóa bảo trì hoặc khung giờ nội bộ
}
