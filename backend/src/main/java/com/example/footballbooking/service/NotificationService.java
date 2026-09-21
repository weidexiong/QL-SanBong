package com.example.footballbooking.service;

import com.example.footballbooking.dto.response.NotificationDto;
import com.example.footballbooking.dto.response.PageResponseDto;
import com.example.footballbooking.entity.Notification;
import com.example.footballbooking.entity.User;
import com.example.footballbooking.exception.ForbiddenException;
import com.example.footballbooking.exception.ResourceNotFoundException;
import com.example.footballbooking.repository.NotificationRepository;
import com.example.footballbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

// Dịch vụ quản lý thông báo người dùng
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    // Xem danh sách thông báo của người dùng
    @Transactional(readOnly = true)
    public PageResponseDto<NotificationDto> getUserNotifications(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notiPage = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);

        List<NotificationDto> dtos = notiPage.getContent().stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return PageResponseDto.<NotificationDto>builder()
                .content(dtos)
                .pageNumber(notiPage.getNumber())
                .pageSize(notiPage.getSize())
                .totalElements(notiPage.getTotalElements())
                .totalPages(notiPage.getTotalPages())
                .isLast(notiPage.isLast())
                .build();
    }

    // Đánh dấu 1 thông báo là đã đọc
    @Transactional
    public void markAsRead(String userEmail, Long notificationId) {
        Notification noti = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông báo"));

        if (!noti.getUser().getEmail().equals(userEmail)) {
            throw new ForbiddenException("Bạn không có quyền thao tác trên thông báo này");
        }

        noti.setRead(true);
        notificationRepository.save(noti);
    }

    // Đếm số thông báo chưa đọc
    @Transactional(readOnly = true)
    public long getUnreadCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));
        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    private NotificationDto toDto(Notification noti) {
        return NotificationDto.builder()
                .id(noti.getId())
                .title(noti.getTitle())
                .message(noti.getMessage())
                .type(noti.getType())
                .isRead(noti.isRead())
                .referenceId(noti.getReferenceId())
                .createdAt(noti.getCreatedAt())
                .build();
    }
}
