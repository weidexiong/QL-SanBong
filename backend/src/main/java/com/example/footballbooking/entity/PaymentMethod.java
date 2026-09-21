package com.example.footballbooking.entity;

// Phương thức thanh toán hỗ trợ
public enum PaymentMethod {
    VIETQR("Chuyển khoản VietQR"),
    MOMO("Ví điện tử MoMo"),
    VNPAY("Cổng thanh toán VNPAY"),
    CASH_AT_FIELD("Thanh toán tiền mặt tại sân");

    private final String displayName;

    PaymentMethod(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
