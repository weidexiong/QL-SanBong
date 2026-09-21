package com.example.footballbooking.dto.response;

import com.example.footballbooking.entity.UserRole;
import com.example.footballbooking.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// DTO chuyển đổi thông tin người dùng an toàn (không chứa mật khẩu)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private UserRole role;
    private UserStatus status;
    private String avatarUrl;
    private LocalDateTime createdAt;
}
