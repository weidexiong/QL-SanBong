package com.example.footballbooking.service;

import com.example.footballbooking.dto.request.BookingCreateRequest;
import com.example.footballbooking.dto.response.BookingResponseDto;
import com.example.footballbooking.dto.response.PageResponseDto;
import com.example.footballbooking.entity.*;
import com.example.footballbooking.exception.BadRequestException;
import com.example.footballbooking.exception.ConflictException;
import com.example.footballbooking.exception.ForbiddenException;
import com.example.footballbooking.exception.ResourceNotFoundException;
import com.example.footballbooking.mapper.BookingMapper;
import com.example.footballbooking.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

// Dịch vụ quản lý đặt sân bóng đá và phòng chống đặt trùng khung giờ (Anti-Double Booking)
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final FootballFieldRepository fieldRepository;
    private final FieldTimeSlotRepository slotRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    // Tạo đơn đặt sân với cơ chế giao dịch cách ly SERIALIZABLE chống tranh chấp (Double Booking)
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public BookingResponseDto createBooking(String userEmail, BookingCreateRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin tài khoản"));

        FootballField field = fieldRepository.findById(request.getFieldId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sân bóng"));

        if (field.getStatus() != FieldStatus.ACTIVE) {
            throw new BadRequestException("Sân bóng hiện chưa sẵn sàng đón khách đặt");
        }

        // 1. KIỂM TRA DOUBLE BOOKING: Đảm bảo khung giờ chưa bị ai đặt trước đó
        boolean isAlreadyBooked = bookingRepository.existsByFieldIdAndBookingDateAndStartTimeAndStatusIn(
                field.getId(),
                request.getBookingDate(),
                request.getStartTime(),
                Arrays.asList(BookingStatus.PENDING, BookingStatus.CONFIRMED)
        );

        if (isAlreadyBooked) {
            // Quy tắc bắt buộc: Nếu slot đã được đặt, trả về HTTP 409 Conflict
            throw new ConflictException("Khung giờ " + request.getStartTime() + " - " + request.getEndTime() +
                    " ngày " + request.getBookingDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) +
                    " đã có người đặt trước. Vui lòng chọn khung giờ khác.");
        }

        // 2. TÍNH GIÁ TIỀN ĐỘC LẬP TẠI BACKEND (Tuyệt đối không tin giá gửi từ frontend)
        long calculatedPrice = field.getBasePrice();
        Optional<FieldTimeSlot> customSlot = slotRepository.findByFieldIdAndStartTimeAndEndTime(
                field.getId(), request.getStartTime(), request.getEndTime()
        );

        if (customSlot.isPresent()) {
            calculatedPrice = customSlot.get().getPrice();
        } else if (request.getStartTime().equals("17:30") || request.getStartTime().equals("19:00")) {
            // Giờ cao điểm phụ thu nếu dùng slot mặc định
            calculatedPrice = Math.round(calculatedPrice * 1.2 / 10000) * 10000;
        }

        // 3. TẠO MÃ ĐẶT SÂN DUY NHẤT: #BK-YYYYMMDD-XXXX
        String dateStr = request.getBookingDate().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomSuffix = String.format("%04d", new Random().nextInt(10000));
        String bookingCode = "#BK-" + dateStr + "-" + randomSuffix;

        // 4. LƯU ĐƠN ĐẶT SÂN
        Booking booking = Booking.builder()
                .bookingCode(bookingCode)
                .user(user)
                .field(field)
                .bookingDate(request.getBookingDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .totalPrice(calculatedPrice)
                .status(BookingStatus.PENDING)
                .customerName(request.getCustomerName() != null ? request.getCustomerName() : user.getFullName())
                .customerPhone(request.getCustomerPhone() != null ? request.getCustomerPhone() : user.getPhone())
                .note(request.getNote())
                .build();

        Booking saved = bookingRepository.save(booking);

        // 5. GỬI THÔNG BÁO TỰ ĐỘNG CHO KHÁCH HÀNG VÀ CHỦ SÂN
        createNotification(
                user,
                "Đặt sân thành công!",
                "Bạn đã tạo đơn đặt sân " + field.getName() + " lúc " + request.getStartTime() + " ngày " + request.getBookingDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                NotificationType.BOOKING_CREATED,
                saved.getId()
        );

        createNotification(
                field.getOwner(),
                "Yêu cầu đặt sân mới",
                "Có khách hàng vừa đặt sân " + field.getName() + " lúc " + request.getStartTime() + " (" + bookingCode + ")",
                NotificationType.BOOKING_CREATED,
                saved.getId()
        );

        return BookingMapper.toDto(saved);
    }

    // Khách hàng xem lịch sử đặt sân của mình
    @Transactional(readOnly = true)
    public PageResponseDto<BookingResponseDto> getMyBookings(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        Pageable pageable = PageRequest.of(page, size);
        Page<Booking> bookingPage = bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);

        List<BookingResponseDto> dtos = bookingPage.getContent().stream()
                .map(BookingMapper::toDto)
                .collect(Collectors.toList());

        return PageResponseDto.<BookingResponseDto>builder()
                .content(dtos)
                .pageNumber(bookingPage.getNumber())
                .pageSize(bookingPage.getSize())
                .totalElements(bookingPage.getTotalElements())
                .totalPages(bookingPage.getTotalPages())
                .isLast(bookingPage.isLast())
                .build();
    }

    // Khách hàng xem chi tiết 1 đơn đặt sân
    @Transactional(readOnly = true)
    public BookingResponseDto getBookingDetail(String userEmail, Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt sân"));

        // Người xem phải là chủ đơn đặt sân, chủ sân của sân đó hoặc admin
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        boolean isAuthorized = booking.getUser().getId().equals(user.getId())
                || booking.getField().getOwner().getId().equals(user.getId())
                || user.getRole() == UserRole.ROLE_ADMIN;

        if (!isAuthorized) {
            throw new ForbiddenException("Bạn không có quyền xem đơn đặt sân này");
        }

        return BookingMapper.toDto(booking);
    }

    // Khách hàng hủy đơn đặt sân
    @Transactional
    public BookingResponseDto cancelBookingByUser(String userEmail, Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt sân"));

        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new ForbiddenException("Bạn không có quyền hủy đơn đặt sân của người khác");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Đơn đặt sân này đã kết thúc hoặc đã được hủy trước đó");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updated = bookingRepository.save(booking);

        createNotification(
                booking.getField().getOwner(),
                "Lịch đặt sân đã bị hủy",
                "Đơn " + booking.getBookingCode() + " đã được khách hàng hủy bỏ.",
                NotificationType.BOOKING_CANCELLED,
                updated.getId()
        );

        return BookingMapper.toDto(updated);
    }

    // Chủ sân xem danh sách đặt sân của các sân mình sở hữu
    @Transactional(readOnly = true)
    public PageResponseDto<BookingResponseDto> getOwnerBookings(String ownerEmail, int page, int size) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chủ sân"));

        Pageable pageable = PageRequest.of(page, size);
        Page<Booking> bookingPage = bookingRepository.findByOwnerIdOrderByCreatedAtDesc(owner.getId(), pageable);

        List<BookingResponseDto> dtos = bookingPage.getContent().stream()
                .map(BookingMapper::toDto)
                .collect(Collectors.toList());

        return PageResponseDto.<BookingResponseDto>builder()
                .content(dtos)
                .pageNumber(bookingPage.getNumber())
                .pageSize(bookingPage.getSize())
                .totalElements(bookingPage.getTotalElements())
                .totalPages(bookingPage.getTotalPages())
                .isLast(bookingPage.isLast())
                .build();
    }

    // Chủ sân xem lịch đặt theo ngày cụ thể (cho chế độ xem Calendar)
    @Transactional(readOnly = true)
    public List<BookingResponseDto> getOwnerBookingsByDate(String ownerEmail, LocalDate date) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chủ sân"));

        return bookingRepository.findByOwnerIdAndDate(owner.getId(), date).stream()
                .map(BookingMapper::toDto)
                .collect(Collectors.toList());
    }

    // Chủ sân xác nhận đơn đặt sân
    @Transactional
    public BookingResponseDto confirmBookingByOwner(String ownerEmail, Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt sân"));

        if (!booking.getField().getOwner().getEmail().equals(ownerEmail)) {
            throw new ForbiddenException("Bạn không có quyền thao tác trên đơn của sân này");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        Booking updated = bookingRepository.save(booking);

        createNotification(
                booking.getUser(),
                "Lịch đặt sân đã được xác nhận!",
                "Chủ sân đã xác nhận đơn đặt sân " + booking.getBookingCode() + " của bạn.",
                NotificationType.BOOKING_CONFIRMED,
                updated.getId()
        );

        return BookingMapper.toDto(updated);
    }

    // Chủ sân từ chối đơn đặt sân
    @Transactional
    public BookingResponseDto rejectBookingByOwner(String ownerEmail, Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt sân"));

        if (!booking.getField().getOwner().getEmail().equals(ownerEmail)) {
            throw new ForbiddenException("Bạn không có quyền thao tác trên đơn của sân này");
        }

        booking.setStatus(BookingStatus.REJECTED);
        Booking updated = bookingRepository.save(booking);

        createNotification(
                booking.getUser(),
                "Lịch đặt sân bị từ chối",
                "Rất tiếc, chủ sân đã từ chối đơn đặt sân " + booking.getBookingCode() + ".",
                NotificationType.BOOKING_REJECTED,
                updated.getId()
        );

        return BookingMapper.toDto(updated);
    }

    // Chủ sân đánh dấu trận đấu hoàn thành
    @Transactional
    public BookingResponseDto completeBookingByOwner(String ownerEmail, Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đặt sân"));

        if (!booking.getField().getOwner().getEmail().equals(ownerEmail)) {
            throw new ForbiddenException("Bạn không có quyền thao tác trên đơn của sân này");
        }

        booking.setStatus(BookingStatus.COMPLETED);
        Booking updated = bookingRepository.save(booking);

        createNotification(
                booking.getUser(),
                "Trận đấu đã hoàn thành",
                "Trận đấu tại sân " + booking.getField().getName() + " đã kết thúc. Hãy để lại đánh giá của bạn nhé!",
                NotificationType.BOOKING_COMPLETED,
                updated.getId()
        );

        return BookingMapper.toDto(updated);
    }

    // Quản trị viên xem tất cả booking
    @Transactional(readOnly = true)
    public PageResponseDto<BookingResponseDto> getAllBookingsForAdmin(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Booking> bookingPage = bookingRepository.findAll(pageable);

        List<BookingResponseDto> dtos = bookingPage.getContent().stream()
                .map(BookingMapper::toDto)
                .collect(Collectors.toList());

        return PageResponseDto.<BookingResponseDto>builder()
                .content(dtos)
                .pageNumber(bookingPage.getNumber())
                .pageSize(bookingPage.getSize())
                .totalElements(bookingPage.getTotalElements())
                .totalPages(bookingPage.getTotalPages())
                .isLast(bookingPage.isLast())
                .build();
    }

    // Hàm tiện ích tạo thông báo người dùng
    private void createNotification(User user, String title, String message, NotificationType type, Long refId) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .referenceId(refId)
                .build();
        notificationRepository.save(notification);
    }
}
