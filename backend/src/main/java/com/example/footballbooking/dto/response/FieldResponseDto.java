package com.example.footballbooking.dto.response;

import com.example.footballbooking.entity.FieldStatus;
import com.example.footballbooking.entity.FieldType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

// DTO chi tiết thông tin sân bóng trả về cho frontend
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FieldResponseDto {
    private Long id;
    private Long ownerId;
    private String ownerName;
    private String ownerPhone;
    private String name;
    private String description;
    private String address;
    private String district;
    private String city;
    private FieldType fieldType;
    private String fieldTypeDisplayName;
    private Long basePrice;
    private FieldStatus status;
    private Double ratingAverage;
    private Integer totalReviews;
    private String primaryImageUrl;
    private List<FieldImageDto> images;
    private List<FacilityDto> facilities;
    private String bankName;
    private String bankAccountNumber;
    private String bankAccountName;
    private LocalDateTime createdAt;
}
