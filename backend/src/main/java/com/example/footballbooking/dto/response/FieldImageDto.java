package com.example.footballbooking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO hình ảnh sân bóng
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FieldImageDto {
    private Long id;
    private String imageUrl;
    private boolean isPrimary;
}
