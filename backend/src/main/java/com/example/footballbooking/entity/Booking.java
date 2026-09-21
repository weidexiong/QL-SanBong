package com.example.footballbooking.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

// Thực thể đơn đặt sân bóng đá
@Entity
@Table(name = "bookings", indexes = {
    @Index(name = "idx_booking_code", columnList = "booking_code"),
    @Index(name = "idx_booking_user", columnList = "user_id"),
    @Index(name = "idx_booking_field_date", columnList = "field_id, booking_date"),
    @Index(name = "idx_booking_slot_check", columnList = "field_id, booking_date, start_time, status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mã đặt sân duy nhất định dạng #BK-XXXXXX
    @Column(name = "booking_code", nullable = false, unique = true, length = 30)
    private String bookingCode;

    // Người đặt sân
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Sân bóng được đặt
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_id", nullable = false)
    private FootballField field;

    // Ngày đặt sân
    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    // Khung giờ bắt đầu (HH:mm)
    @Column(name = "start_time", nullable = false, length = 10)
    private String startTime;

    // Khung giờ kết thúc (HH:mm)
    @Column(name = "end_time", nullable = false, length = 10)
    private String endTime;

    // Tổng tiền thanh toán (VNĐ) - do backend tính toán độc lập
    @Column(name = "total_price", nullable = false)
    private Long totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "customer_name", length = 100)
    private String customerName;

    @Column(name = "customer_phone", length = 20)
    private String customerPhone;

    @Column(columnDefinition = "TEXT")
    private String note;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
