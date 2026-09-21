package com.example.footballbooking.controller;

import com.example.footballbooking.dto.request.ReviewCreateRequest;
import com.example.footballbooking.dto.response.ApiResponse;
import com.example.footballbooking.dto.response.PageResponseDto;
import com.example.footballbooking.dto.response.ReviewResponseDto;
import com.example.footballbooking.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

// Controller tiếp nhận đánh giá chất lượng sân bóng
@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Các API đánh giá sao và bình luận chất lượng sân")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @Operation(summary = "Gửi đánh giá sân bóng", description = "Chỉ cho phép khách hàng đã hoàn thành trận đấu (COMPLETED) đánh giá 1 lần")
    public ResponseEntity<ApiResponse<ReviewResponseDto>> createReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ReviewCreateRequest request
    ) {
        ReviewResponseDto review = reviewService.createReview(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Cảm ơn bạn đã gửi đánh giá!", review));
    }

    @GetMapping("/field/{fieldId}")
    @Operation(summary = "Danh sách đánh giá của sân bóng", description = "Lấy các bình luận và số sao đánh giá của sân bóng kèm phân trang")
    public ResponseEntity<ApiResponse<PageResponseDto<ReviewResponseDto>>> getFieldReviews(
            @PathVariable Long fieldId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponseDto<ReviewResponseDto> response = reviewService.getFieldReviews(fieldId, page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
