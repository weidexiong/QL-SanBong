package com.example.footballbooking.service;

import com.example.footballbooking.dto.request.PaymentCreateRequest;
import com.example.footballbooking.dto.response.PaymentResponseDto;
import com.example.footballbooking.entity.*;
import com.example.footballbooking.exception.BadRequestException;
import com.example.footballbooking.exception.ForbiddenException;
import com.example.footballbooking.exception.ResourceNotFoundException;
import com.example.footballbooking.repository.BookingRepository;
import com.example.footballbooking.repository.NotificationRepository;
import com.example.footballbooking.repository.PaymentRepository;
import com.example.footballbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

// Dịch vụ quản lý thanh toán tiền sân
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    // Khởi tạo yêu cầu thanh toán
    @Transactional
    public PaymentResponseDto createPayment(String userEmail, PaymentCreateRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt sân"));

        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new ForbiddenException("Bạn không có quyền thanh toán cho đơn của người khác");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.REJECTED) {
            throw new BadRequestException("Đơn đặt sân này đã bị hủy hoặc bị từ chối");
        }

        // Tạo mã giao dịch thanh toán duy nhất: TXN-YYYYMMDD-XXXX
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String randomSuffix = String.format("%04d", new Random().nextInt(10000));
        String txnCode = "TXN-" + dateStr + "-" + randomSuffix;

        Payment payment = Payment.builder()
                .booking(booking)
                .user(booking.getUser())
                .amount(booking.getTotalPrice())
                .paymentMethod(request.getPaymentMethod())
                .status(PaymentStatus.PENDING)
                .transactionCode(txnCode)
                .build();

        Payment saved = paymentRepository.save(payment);

        return toDto(saved);
    }

    // Giả lập thanh toán thành công (Webhook / Xác nhận chuyển khoản)
    @Transactional
    public PaymentResponseDto simulateSuccess(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin giao dịch"));

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaymentTime(LocalDateTime.now());
        Payment saved = paymentRepository.save(payment);

        // Tự động chuyển booking sang CONFIRMED
        Booking booking = payment.getBooking();
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        // Tạo thông báo xác nhận thanh toán thành công
        Notification noti = Notification.builder()
                .user(payment.getUser())
                .title("Thanh toán thành công!")
                .message("Đơn đặt sân " + booking.getBookingCode() + " đã được thanh toán thành công qua " + payment.getPaymentMethod().getDisplayName() + ".")
                .type(NotificationType.PAYMENT_SUCCESS)
                .referenceId(booking.getId())
                .build();
        notificationRepository.save(noti);

        return toDto(saved);
    }

    private PaymentResponseDto toDto(Payment payment) {
        String qrData = "SANBONG_" + payment.getBooking().getBookingCode() + "_" + payment.getAmount();

        return PaymentResponseDto.builder()
                .id(payment.getId())
                .bookingId(payment.getBooking().getId())
                .bookingCode(payment.getBooking().getBookingCode())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .paymentMethodDisplayName(payment.getPaymentMethod().getDisplayName())
                .status(payment.getStatus())
                .transactionCode(payment.getTransactionCode())
                .qrCodeData(qrData)
                .paymentTime(payment.getPaymentTime())
                .build();
    }
}
