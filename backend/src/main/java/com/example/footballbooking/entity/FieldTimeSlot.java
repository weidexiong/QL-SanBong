package com.example.footballbooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

// Cấu hình khung giờ và biểu giá của từng sân bóng
@Entity
@Table(name = "field_time_slots", indexes = {
    @Index(name = "idx_slot_field", columnList = "field_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FieldTimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_id", nullable = false)
    @JsonIgnore
    private FootballField field;

    // Giờ bắt đầu theo định dạng HH:mm (ví dụ: 18:00)
    @Column(name = "start_time", nullable = false, length = 10)
    private String startTime;

    // Giờ kết thúc theo định dạng HH:mm (ví dụ: 19:30)
    @Column(name = "end_time", nullable = false, length = 10)
    private String endTime;

    // Giá thuê của khung giờ này (VNĐ)
    @Column(nullable = false)
    private Long price;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;
}
