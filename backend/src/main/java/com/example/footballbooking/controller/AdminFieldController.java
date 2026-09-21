package com.example.footballbooking.controller;

import com.example.footballbooking.dto.response.ApiResponse;
import com.example.footballbooking.dto.response.FieldResponseDto;
import com.example.footballbooking.dto.response.PageResponseDto;
import com.example.footballbooking.entity.FieldStatus;
import com.example.footballbooking.service.FieldService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

// Controller dành riêng cho Quản trị viên (ROLE_ADMIN) kiểm duyệt và quản lý toàn bộ sân
@RestController
@RequestMapping("/api/v1/admin/fields")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Tag(name = "Admin Fields", description = "Các API kiểm duyệt và quản trị danh sách sân bóng toàn hệ thống")
public class AdminFieldController {

    private final FieldService fieldService;

    @GetMapping
    @Operation(summary = "Xem toàn bộ sân bóng", description = "Admin xem tất cả sân bóng kể cả sân chờ duyệt, kèm phân trang")
    public ResponseEntity<ApiResponse<PageResponseDto<FieldResponseDto>>> getAllFields(
            @RequestParam(required = false) FieldStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponseDto<FieldResponseDto> response = fieldService.getAllFieldsForAdmin(status, page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/{id}/approve")
    @Operation(summary = "Phê duyệt sân bóng", description = "Chuyển trạng thái sân sang ACTIVE để hiển thị cho khách hàng")
    public ResponseEntity<ApiResponse<FieldResponseDto>> approveField(@PathVariable Long id) {
        FieldResponseDto field = fieldService.approveField(id);
        return ResponseEntity.ok(ApiResponse.ok("Đã phê duyệt sân bóng thành công", field));
    }

    @PutMapping("/{id}/reject")
    @Operation(summary = "Từ chối sân bóng", description = "Từ chối phê duyệt sân bóng không đạt yêu cầu")
    public ResponseEntity<ApiResponse<FieldResponseDto>> rejectField(@PathVariable Long id) {
        FieldResponseDto field = fieldService.rejectField(id);
        return ResponseEntity.ok(ApiResponse.ok("Đã từ chối sân bóng này", field));
    }
}
