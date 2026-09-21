package com.example.footballbooking.controller;

import com.example.footballbooking.dto.request.FieldCreateRequest;
import com.example.footballbooking.dto.request.FieldUpdateRequest;
import com.example.footballbooking.dto.response.ApiResponse;
import com.example.footballbooking.dto.response.FieldResponseDto;
import com.example.footballbooking.service.FieldService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Controller dành riêng cho Chủ sân (ROLE_CHUSAN) quản lý sân bóng của mình
@RestController
@RequestMapping("/api/v1/owner/fields")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_CHUSAN')")
@Tag(name = "Owner Fields", description = "Các API quản lý sân bóng thuộc sở hữu của Chủ sân")
public class OwnerFieldController {

    private final FieldService fieldService;

    @GetMapping
    @Operation(summary = "Danh sách sân của chủ sân", description = "Trả về tất cả sân bóng do chủ sân hiện tại quản lý")
    public ResponseEntity<ApiResponse<List<FieldResponseDto>>> getMyFields(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<FieldResponseDto> fields = fieldService.getFieldsByOwner(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(fields));
    }

    @PostMapping
    @Operation(summary = "Tạo mới sân bóng", description = "Chủ sân đăng tải sân mới lên hệ thống, trạng thái ban đầu là chờ duyệt")
    public ResponseEntity<ApiResponse<FieldResponseDto>> createField(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody FieldCreateRequest request
    ) {
        FieldResponseDto field = fieldService.createFieldByOwner(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Tạo mới sân bóng thành công, vui lòng chờ Admin duyệt", field));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật thông tin sân bóng", description = "Chủ sân chỉnh sửa thông tin sân thuộc quyền sở hữu")
    public ResponseEntity<ApiResponse<FieldResponseDto>> updateField(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody FieldUpdateRequest request
    ) {
        FieldResponseDto field = fieldService.updateFieldByOwner(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật sân bóng thành công", field));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa sân bóng", description = "Chủ sân xóa sân bóng thuộc quyền sở hữu")
    public ResponseEntity<ApiResponse<Void>> deleteField(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        fieldService.deleteFieldByOwner(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.ok("Đã xóa sân bóng thành công", null));
    }
}
