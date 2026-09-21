package com.example.footballbooking.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

// Thực thể quản lý refresh token
@Entity
@Table(name = "refresh_tokens", indexes = {
    @Index(name = "idx_token_value", columnList = "token")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(nullable = false, unique = true, length = 255)
    private String token;

    @Column(name = "expiry_date", nullable = false)
    private Instant expiryDate;
}
