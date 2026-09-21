package com.example.footballbooking.controller;

import com.example.footballbooking.dto.response.ApiResponse;
import com.example.footballbooking.dto.response.PageResponseDto;
import com.example.footballbooking.dto.response.UserDto;
import com.example.footballbooking.entity.UserRole;
import com.example.footballbooking.entity.UserStatus;
import com.example.footballbooking.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

// Controller quản lý danh sách người dùng và kiểm duyệt chủ sân cho Quản trị viên (ROLE_ADMIN)
@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Tag(name = "Admin Users", description = "Các API quản lý tài khoản người dùng và xét duyệt hồ sơ chủ sân")
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "Danh sách người dùng", description = "Lấy danh sách người dùng kèm phân trang và lọc theo vai trò, trạng thái")
    public ResponseEntity<ApiResponse<PageResponseDto<UserDto>>> getAllUsers(
            @RequestParam(required = false) UserRole role,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponseDto<UserDto> response = userService.getAllUsers(role, status, page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/{id}/approve-owner")
    @Operation(summary = "Phê duyệt đối tác Chủ sân", description = "Chuyển trạng thái chủ sân từ PENDING sang ACTIVE để được phép đăng sân")
    public ResponseEntity<ApiResponse<UserDto>> approveOwner(@PathVariable Long id) {
        UserDto user = userService.approveOwner(id);
        return ResponseEntity.ok(ApiResponse.ok("Đã phê duyệt tài khoản Chủ sân thành công", user));
    }

    @PutMapping("/{id}/reject-owner")
    @Operation(summary = "Từ chối đối tác Chủ sân", description = "Chuyển trạng thái chủ sân sang REJECTED")
    public ResponseEntity<ApiResponse<UserDto>> rejectOwner(@PathVariable Long id) {
        UserDto user = userService.rejectOwner(id);
        return ResponseEntity.ok(ApiResponse.ok("Đã từ chối tài khoản Chủ sân này", user));
    }

    @PutMapping("/{id}/toggle-lock")
    @Operation(summary = "Khóa hoặc mở khóa tài khoản", description = "Chuyển đổi trạng thái giữa ACTIVE và LOCKED")
    public ResponseEntity<ApiResponse<UserDto>> toggleLock(@PathVariable Long id) {
        UserDto user = userService.toggleLock(id);
        return ResponseEntity.ok(ApiResponse.ok("Đã cập nhật trạng thái tài khoản", user));
    }
}
