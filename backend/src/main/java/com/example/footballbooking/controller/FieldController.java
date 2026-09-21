package com.example.footballbooking.controller;

import com.example.footballbooking.dto.response.ApiResponse;
import com.example.footballbooking.dto.response.FieldResponseDto;
import com.example.footballbooking.dto.response.PageResponseDto;
import com.example.footballbooking.entity.FieldType;
import com.example.footballbooking.service.FieldService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Controller công khai cho khách hàng tìm kiếm và xem chi tiết sân bóng
@RestController
@RequestMapping("/api/v1/fields")
@RequiredArgsConstructor
@Tag(name = "Fields", description = "Các API tìm kiếm và xem thông tin sân bóng đá cho khách hàng")
public class FieldController {

    private final FieldService fieldService;

    @GetMapping
    @Operation(summary = "Tìm kiếm sân bóng", description = "Tìm kiếm sân có trạng thái ACTIVE với bộ lọc địa điểm, giá, loại sân và phân trang")
    public ResponseEntity<ApiResponse<PageResponseDto<FieldResponseDto>>> searchFields(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) FieldType fieldType,
            @RequestParam(required = false) Long minPrice,
            @RequestParam(required = false) Long maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "ratingAverage") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        PageResponseDto<FieldResponseDto> response = fieldService.searchActiveFields(
                keyword, city, district, fieldType, minPrice, maxPrice, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết sân bóng", description = "Lấy thông tin chi tiết một sân bóng theo ID bao gồm tiện ích và hình ảnh")
    public ResponseEntity<ApiResponse<FieldResponseDto>> getFieldDetail(@PathVariable Long id) {
        FieldResponseDto field = fieldService.getFieldById(id);
        return ResponseEntity.ok(ApiResponse.ok(field));
    }
}
