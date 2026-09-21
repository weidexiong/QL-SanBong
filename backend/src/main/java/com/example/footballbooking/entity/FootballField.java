package com.example.footballbooking.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

// Thực thể sân bóng đá
@Entity
@Table(name = "fields", indexes = {
    @Index(name = "idx_field_status", columnList = "status"),
    @Index(name = "idx_field_city", columnList = "city"),
    @Index(name = "idx_field_district", columnList = "district"),
    @Index(name = "idx_field_type", columnList = "field_type"),
    @Index(name = "idx_field_price", columnList = "base_price")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FootballField {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Chủ sở hữu sân bóng (Chủ sân - ROLE_CHUSAN)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(nullable = false, length = 100)
    private String city;

    @Enumerated(EnumType.STRING)
    @Column(name = "field_type", nullable = false, length = 30)
    private FieldType fieldType;

    // Giá thuê cơ bản (VNĐ)
    @Column(name = "base_price", nullable = false)
    private Long basePrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private FieldStatus status = FieldStatus.PENDING_APPROVAL;

    @Column(name = "rating_average", nullable = false)
    @Builder.Default
    private Double ratingAverage = 5.0;

    @Column(name = "total_reviews", nullable = false)
    @Builder.Default
    private Integer totalReviews = 0;

    // Thông tin tài khoản ngân hàng nhận tiền của chủ sân cho cụm sân này
    @Column(name = "bank_name", length = 50)
    private String bankName;

    @Column(name = "bank_account_number", length = 50)
    private String bankAccountNumber;

    @Column(name = "bank_account_name", length = 100)
    private String bankAccountName;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "field_facilities",
        joinColumns = @JoinColumn(name = "field_id"),
        inverseJoinColumns = @JoinColumn(name = "facility_id")
    )
    @Builder.Default
    private Set<Facility> facilities = new HashSet<>();

    @OneToMany(mappedBy = "field", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<FieldImage> images = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Thêm ảnh vào danh sách
    public void addImage(FieldImage image) {
        images.add(image);
        image.setField(this);
    }
}
