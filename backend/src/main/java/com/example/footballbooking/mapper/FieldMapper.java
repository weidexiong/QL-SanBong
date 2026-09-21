package com.example.footballbooking.mapper;

import com.example.footballbooking.dto.response.FacilityDto;
import com.example.footballbooking.dto.response.FieldImageDto;
import com.example.footballbooking.dto.response.FieldResponseDto;
import com.example.footballbooking.entity.FootballField;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

// Chuyển đổi dữ liệu FootballField sang DTO trả về cho API
public class FieldMapper {

    public static FieldResponseDto toDto(FootballField field) {
        if (field == null) {
            return null;
        }

        List<FacilityDto> facilities = field.getFacilities() == null ? Collections.emptyList() :
                field.getFacilities().stream()
                        .map(f -> FacilityDto.builder()
                                .id(f.getId())
                                .name(f.getName())
                                .iconKey(f.getIconKey())
                                .build())
                        .collect(Collectors.toList());

        List<FieldImageDto> images = field.getImages() == null ? Collections.emptyList() :
                field.getImages().stream()
                        .map(img -> FieldImageDto.builder()
                                .id(img.getId())
                                .imageUrl(img.getImageUrl())
                                .isPrimary(img.isPrimary())
                                .build())
                        .collect(Collectors.toList());

        String primaryImageUrl = images.stream()
                .filter(FieldImageDto::isPrimary)
                .map(FieldImageDto::getImageUrl)
                .findFirst()
                .orElse(images.isEmpty() ? null : images.get(0).getImageUrl());

        return FieldResponseDto.builder()
                .id(field.getId())
                .ownerId(field.getOwner() != null ? field.getOwner().getId() : null)
                .ownerName(field.getOwner() != null ? field.getOwner().getFullName() : "")
                .ownerPhone(field.getOwner() != null ? field.getOwner().getPhone() : "")
                .name(field.getName())
                .description(field.getDescription())
                .address(field.getAddress())
                .district(field.getDistrict())
                .city(field.getCity())
                .fieldType(field.getFieldType())
                .fieldTypeDisplayName(field.getFieldType() != null ? field.getFieldType().getDisplayName() : "")
                .basePrice(field.getBasePrice())
                .status(field.getStatus())
                .ratingAverage(field.getRatingAverage())
                .totalReviews(field.getTotalReviews())
                .primaryImageUrl(primaryImageUrl)
                .images(images)
                .facilities(facilities)
                .bankName(field.getBankName())
                .bankAccountNumber(field.getBankAccountNumber())
                .bankAccountName(field.getBankAccountName())
                .createdAt(field.getCreatedAt())
                .build();
    }
}
