package com.example.footballbooking.controller;

import com.example.footballbooking.dto.request.PaymentCreateRequest;
import com.example.footballbooking.dto.response.ApiResponse;
import com.example.footballbooking.dto.response.PaymentResponseDto;
import com.example.footballbooking.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

// Controller xử lý thanh toán tiền sân
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Các API thanh toán trực tuyến qua VietQR, MoMo, VNPAY")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    @Operation(summary = "Khởi tạo yêu cầu thanh toán", description = "Tạo mã giao dịch và mã VietQR thanh toán cho đơn đặt sân")
    public ResponseEntity<ApiResponse<PaymentResponseDto>> createPayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PaymentCreateRequest request
    ) {
        PaymentResponseDto payment = paymentService.createPayment(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Khởi tạo yêu cầu thanh toán thành công", payment));
    }

    @PostMapping("/{id}/simulate-success")
    @Operation(summary = "Giả lập thanh toán thành công", description = "Mô phỏng xác nhận tiền về từ ngân hàng hoặc cổng thanh toán")
    public ResponseEntity<ApiResponse<PaymentResponseDto>> simulateSuccess(@PathVariable Long id) {
        PaymentResponseDto payment = paymentService.simulateSuccess(id);
        return ResponseEntity.ok(ApiResponse.ok("Thanh toán thành công! Sân đã được xác nhận.", payment));
    }
}
