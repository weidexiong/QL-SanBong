package com.example.footballbooking.service;

import com.example.footballbooking.dto.response.PageResponseDto;
import com.example.footballbooking.dto.response.UserDto;
import com.example.footballbooking.entity.User;
import com.example.footballbooking.entity.UserRole;
import com.example.footballbooking.entity.UserStatus;
import com.example.footballbooking.exception.BadRequestException;
import com.example.footballbooking.exception.ResourceNotFoundException;
import com.example.footballbooking.mapper.UserMapper;
import com.example.footballbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// Dịch vụ quản trị người dùng và phê duyệt chủ sân cho Quản trị viên
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // Lấy danh sách người dùng có phân trang và bộ lọc theo vai trò, trạng thái
    @Transactional(readOnly = true)
    public PageResponseDto<UserDto> getAllUsers(UserRole role, UserStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> userPage;

        if (role != null && status != null) {
            userPage = userRepository.findByRoleAndStatus(role, status, pageable);
        } else if (role != null) {
            userPage = userRepository.findByRole(role, pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }

        List<UserDto> dtos = userPage.getContent().stream()
                .map(UserMapper::toDto)
                .toList();

        return PageResponseDto.<UserDto>builder()
                .content(dtos)
                .pageNumber(userPage.getNumber())
                .pageSize(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .isLast(userPage.isLast())
                .build();
    }

    // Quản trị viên phê duyệt tài khoản Chủ sân (Requirement 48)
    @Transactional
    public UserDto approveOwner(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + userId));

        if (user.getRole() != UserRole.ROLE_CHUSAN) {
            throw new BadRequestException("Tài khoản này không phải là đối tác Chủ sân");
        }

        user.setStatus(UserStatus.ACTIVE);
        user = userRepository.save(user);
        return UserMapper.toDto(user);
    }

    // Quản trị viên từ chối tài khoản Chủ sân (Requirement 48)
    @Transactional
    public UserDto rejectOwner(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + userId));

        if (user.getRole() != UserRole.ROLE_CHUSAN) {
            throw new BadRequestException("Tài khoản này không phải là đối tác Chủ sân");
        }

        user.setStatus(UserStatus.REJECTED);
        user = userRepository.save(user);
        return UserMapper.toDto(user);
    }

    // Khóa hoặc mở khóa tài khoản người dùng
    @Transactional
    public UserDto toggleLock(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + userId));

        if (user.getRole() == UserRole.ROLE_ADMIN) {
            throw new BadRequestException("Không thể khóa tài khoản Quản trị viên");
        }

        if (user.getStatus() == UserStatus.LOCKED) {
            user.setStatus(UserStatus.ACTIVE);
        } else {
            user.setStatus(UserStatus.LOCKED);
        }

        user = userRepository.save(user);
        return UserMapper.toDto(user);
    }
}
