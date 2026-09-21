package com.example.footballbooking.entity;

// Trạng thái phê duyệt và hoạt động của sân bóng
public enum FieldStatus {
    PENDING_APPROVAL, // Sân mới tạo đang chờ Admin duyệt
    ACTIVE,           // Đã duyệt và đang hiển thị cho khách đặt
    REJECTED,         // Bị Admin từ chối phê duyệt
    INACTIVE          // Tạm ngưng hoạt động / bảo trì
}
