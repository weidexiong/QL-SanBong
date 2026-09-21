package com.example.footballbooking.mapper;

import com.example.footballbooking.dto.response.UserDto;
import com.example.footballbooking.entity.User;

// Chuyển đổi dữ liệu User sang DTO an toàn
public class UserMapper {

    public static UserDto toDto(User user) {
        if (user == null) {
            return null;
        }

        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .status(user.getStatus())
                .avatarUrl(user.getAvatarUrl())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
