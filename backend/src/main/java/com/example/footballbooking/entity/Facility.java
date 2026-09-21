package com.example.footballbooking.entity;

import jakarta.persistence.*;
import lombok.*;

// Tiện ích sân bóng (Wifi, Đèn chiếu sáng ban đêm, Bãi giữ xe, Căn tin, v.v.)
@Entity
@Table(name = "facilities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Facility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    // Tên icon Lucide tương ứng (Wifi, Car, Lightbulb, Coffee, Shirt, ShowerHead, Trophy, etc.)
    @Column(name = "icon_key", nullable = false, length = 50)
    private String iconKey;
}
