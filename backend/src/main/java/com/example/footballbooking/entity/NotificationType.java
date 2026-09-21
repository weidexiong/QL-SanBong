package com.example.footballbooking.entity;

// Loại thông báo hệ thống gửi đến người dùng
public enum NotificationType {
    BOOKING_CREATED,
    BOOKING_CONFIRMED,
    BOOKING_REJECTED,
    BOOKING_CANCELLED,
    BOOKING_COMPLETED,
    PAYMENT_SUCCESS,
    PAYMENT_FAILED
}
