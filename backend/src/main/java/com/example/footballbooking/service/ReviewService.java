package com.example.footballbooking.service;

import com.example.footballbooking.dto.request.ReviewCreateRequest;
import com.example.footballbooking.dto.response.PageResponseDto;
import com.example.footballbooking.dto.response.ReviewResponseDto;
import com.example.footballbooking.entity.*;
import com.example.footballbooking.exception.BadRequestException;
import com.example.footballbooking.exception.ForbiddenException;
import com.example.footballbooking.exception.ResourceNotFoundException;
import com.example.footballbooking.repository.BookingRepository;
import com.example.footballbooking.repository.FootballFieldRepository;
import com.example.footballbooking.repository.ReviewRepository;
import com.example.footballbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

// Dịch vụ quản lý đánh giá và nhận xét chất lượng sân bóng
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final FootballFieldRepository fieldRepository;
    private final UserRepository userRepository;

    // Gửi đánh giá cho một đơn đặt sân đã hoàn thành
    @Transactional
    public ReviewResponseDto createReview(String userEmail, ReviewCreateRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt sân"));

        // Kiểm tra quyền: Chỉ chính chủ đơn đặt sân mới được đánh giá
        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new ForbiddenException("Bạn không thể đánh giá cho đơn đặt sân của người khác");
        }

        // Quy tắc 50: Chỉ booking có trạng thái COMPLETED mới được phép đánh giá
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("Chỉ có thể đánh giá sau khi trận đấu đã hoàn thành (COMPLETED)");
        }

        // Quy tắc 50: Một booking chỉ được review duy nhất 1 lần
        if (reviewRepository.existsByBookingId(booking.getId())) {
            throw new BadRequestException("Đơn đặt sân này đã được đánh giá trước đó. Mỗi đơn chỉ được đánh giá 1 lần.");
        }

        FootballField field = booking.getField();
        User user = booking.getUser();

        Review review = Review.builder()
                .booking(booking)
                .user(user)
                .field(field)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review saved = reviewRepository.save(review);

        // Cập nhật lại rating trung bình và tổng số đánh giá của sân bóng
        Double avgRating = reviewRepository.calculateAverageRatingByFieldId(field.getId());
        long totalReviews = reviewRepository.countByFieldId(field.getId());

        field.setRatingAverage(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 5.0);
        field.setTotalReviews((int) totalReviews);
        fieldRepository.save(field);

        return toDto(saved);
    }

    // Lấy danh sách đánh giá của một sân bóng
    @Transactional(readOnly = true)
    public PageResponseDto<ReviewResponseDto> getFieldReviews(Long fieldId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviewPage = reviewRepository.findByFieldIdOrderByCreatedAtDesc(fieldId, pageable);

        List<ReviewResponseDto> dtos = reviewPage.getContent().stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return PageResponseDto.<ReviewResponseDto>builder()
                .content(dtos)
                .pageNumber(reviewPage.getNumber())
                .pageSize(reviewPage.getSize())
                .totalElements(reviewPage.getTotalElements())
                .totalPages(reviewPage.getTotalPages())
                .isLast(reviewPage.isLast())
                .build();
    }

    private ReviewResponseDto toDto(Review review) {
        return ReviewResponseDto.builder()
                .id(review.getId())
                .bookingId(review.getBooking().getId())
                .userName(review.getUser().getFullName())
                .userAvatar(review.getUser().getAvatarUrl())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
