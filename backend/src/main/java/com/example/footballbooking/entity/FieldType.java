package com.example.footballbooking.entity;

// Phân loại sân bóng theo số lượng người
public enum FieldType {
    SAN_5("Sân 5 người"),
    SAN_7("Sân 7 người"),
    SAN_11("Sân 11 người standard");

    private final String displayName;

    FieldType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
