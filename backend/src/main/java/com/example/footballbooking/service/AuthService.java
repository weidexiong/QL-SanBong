package com.example.footballbooking.service;

import com.example.footballbooking.dto.request.LoginRequest;
import com.example.footballbooking.dto.request.RefreshTokenRequest;
import com.example.footballbooking.dto.request.RegisterRequest;
import com.example.footballbooking.dto.response.AuthResponse;
import com.example.footballbooking.dto.response.UserDto;
import com.example.footballbooking.entity.RefreshToken;
import com.example.footballbooking.entity.User;
import com.example.footballbooking.entity.UserRole;
import com.example.footballbooking.entity.UserStatus;
import com.example.footballbooking.exception.BadRequestException;
import com.example.footballbooking.exception.ResourceNotFoundException;
import com.example.footballbooking.exception.UnauthorizedException;
import com.example.footballbooking.mapper.UserMapper;
import com.example.footballbooking.repository.RefreshTokenRepository;
import com.example.footballbooking.repository.UserRepository;
import com.example.footballbooking.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

// Dịch vụ xử lý đăng ký, đăng nhập và xác thực người dùng
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Value("${app.jwt.refresh-expiration-ms}")
    private Long refreshExpirationMs;

    // Đăng ký tài khoản mới cho Khách hàng hoặc Chủ sân
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email này đã được đăng ký trong hệ thống");
        }

        UserRole role = request.getRole() != null ? request.getRole() : UserRole.ROLE_USER;
        // Chủ sân khi đăng ký ban đầu sẽ ở trạng thái PENDING chờ Admin phê duyệt
        UserStatus status = (role == UserRole.ROLE_CHUSAN) ? UserStatus.PENDING : UserStatus.ACTIVE;

        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .phone(request.getPhone().trim())
                .role(role)
                .status(status)
                .build();

        user = userRepository.save(user);

        // Tạo access token và refresh token
        String accessToken = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
        RefreshToken refreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .user(UserMapper.toDto(user))
                .build();
    }

    // Đăng nhập hệ thống bằng email và mật khẩu
    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new UnauthorizedException("Email hoặc mật khẩu không chính xác"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Email hoặc mật khẩu không chính xác");
        }

        if (user.getStatus() == UserStatus.LOCKED) {
            throw new BadRequestException("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ ban quản trị.");
        }

        // Tạo token mới
        String accessToken = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
        RefreshToken refreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .user(UserMapper.toDto(user))
                .build();
    }

    // Làm mới access token khi token cũ hết hạn
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken token = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new UnauthorizedException("Refresh token không hợp lệ"));

        // Kiểm tra thời hạn refresh token
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new UnauthorizedException("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        }

        User user = token.getUser();
        String newAccessToken = jwtUtils.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(token.getToken())
                .user(UserMapper.toDto(user))
                .build();
    }

    // Đăng xuất và xóa refresh token
    @Transactional
    public void logout(String email) {
        userRepository.findByEmail(email).ifPresent(refreshTokenRepository::deleteByUser);
    }

    // Lấy thông tin tài khoản hiện tại từ email đã xác thực
    @Transactional(readOnly = true)
    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin người dùng"));
        return UserMapper.toDto(user);
    }

    // Tạo mới hoặc làm mới RefreshToken cho người dùng
    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = refreshTokenRepository.findByUser(user)
                .orElseGet(() -> RefreshToken.builder().user(user).build());

        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshExpirationMs));

        return refreshTokenRepository.save(refreshToken);
    }
}
