package com.example.footballbooking.config;

import com.example.footballbooking.entity.User;
import com.example.footballbooking.entity.UserRole;
import com.example.footballbooking.entity.UserStatus;
import com.example.footballbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// Tự động khởi tạo tài khoản demo ban đầu khi hệ thống khởi chạy lần đầu
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // 1. Tài khoản Quản trị viên (ADMIN)
        if (!userRepository.existsByEmail("admin@football.vn")) {
            User admin = User.builder()
                    .email("admin@football.vn")
                    .password(passwordEncoder.encode("Admin@123"))
                    .fullName("Quản Trị Viên Hệ Thống")
                    .phone("0901234567")
                    .role(UserRole.ROLE_ADMIN)
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(admin);
        }

        // 2. Tài khoản Chủ sân bóng (CHUSAN) - Đã được duyệt
        if (!userRepository.existsByEmail("chusan@football.vn")) {
            User chusan = User.builder()
                    .email("chusan@football.vn")
                    .password(passwordEncoder.encode("Chusan@123"))
                    .fullName("Nguyễn Văn Chủ Sân")
                    .phone("0912345678")
                    .role(UserRole.ROLE_CHUSAN)
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(chusan);
        }

        // 3. Tài khoản Chủ sân bóng (CHUSAN) - Đang chờ duyệt
        if (!userRepository.existsByEmail("chusan_moi@football.vn")) {
            User chusanMoi = User.builder()
                    .email("chusan_moi@football.vn")
                    .password(passwordEncoder.encode("Chusan@123"))
                    .fullName("Trần Đình Mới Đăng Ký")
                    .phone("0923456789")
                    .role(UserRole.ROLE_CHUSAN)
                    .status(UserStatus.PENDING)
                    .build();
            userRepository.save(chusanMoi);
        }

        // 4. Tài khoản Khách hàng (USER)
        if (!userRepository.existsByEmail("user@football.vn")) {
            User user = User.builder()
                    .email("user@football.vn")
                    .password(passwordEncoder.encode("User@123"))
                    .fullName("Lê Hoàng Đặt Sân")
                    .phone("0934567890")
                    .role(UserRole.ROLE_USER)
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(user);
        }

        // 5. Khởi tạo danh mục tiện ích sân bóng phổ biến
        seedFacilities();

        // 6. Khởi tạo danh sách sân bóng mẫu với trạng thái ACTIVE và PENDING_APPROVAL
        seedFootballFields();
    }

    private final com.example.footballbooking.repository.FacilityRepository facilityRepository;
    private final com.example.footballbooking.repository.FootballFieldRepository fieldRepository;

    private void seedFacilities() {
        if (facilityRepository.count() == 0) {
            facilityRepository.save(com.example.footballbooking.entity.Facility.builder().name("Chiếu sáng ban đêm").iconKey("Lightbulb").build());
            facilityRepository.save(com.example.footballbooking.entity.Facility.builder().name("Wifi miễn phí").iconKey("Wifi").build());
            facilityRepository.save(com.example.footballbooking.entity.Facility.builder().name("Bãi giữ xe rộng rãi").iconKey("Car").build());
            facilityRepository.save(com.example.footballbooking.entity.Facility.builder().name("Căn tin nước giải khát").iconKey("Coffee").build());
            facilityRepository.save(com.example.footballbooking.entity.Facility.builder().name("Phòng thay đồ & tắm").iconKey("Shirt").build());
            facilityRepository.save(com.example.footballbooking.entity.Facility.builder().name("Cho thuê bóng & áo đấu").iconKey("Trophy").build());
        }
    }

    private void seedFootballFields() {
        if (fieldRepository.count() == 0) {
            User chusan = userRepository.findByEmail("chusan@football.vn").orElse(null);
            if (chusan == null) return;

            java.util.Set<com.example.footballbooking.entity.Facility> allFacs =
                    new java.util.HashSet<>(facilityRepository.findAll());

            // Sân 1: Sân bóng Chảo Lửa Tân Bình (Sân 7)
            com.example.footballbooking.entity.FootballField field1 = com.example.footballbooking.entity.FootballField.builder()
                    .owner(chusan)
                    .name("Sân bóng Chảo Lửa Tân Bình")
                    .description("Sân cỏ nhân tạo chất lượng cao nhập khẩu từ Ý, hệ thống đèn LED chống chói chuẩn thi đấu, bãi đỗ xe ô tô và xe máy rộng rãi có mái che.")
                    .address("30 Phan Thúc Duyện, Phường 4")
                    .district("Quận Tân Bình")
                    .city("Hồ Chí Minh")
                    .fieldType(com.example.footballbooking.entity.FieldType.SAN_7)
                    .basePrice(350000L)
                    .status(com.example.footballbooking.entity.FieldStatus.ACTIVE)
                    .ratingAverage(4.9)
                    .totalReviews(24)
                    .facilities(allFacs)
                    .bankName("MBBank")
                    .bankAccountNumber("0912345678")
                    .bankAccountName("NGUYEN VAN CHU SAN")
                    .build();
            field1.addImage(com.example.footballbooking.entity.FieldImage.builder().imageUrl("https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80").isPrimary(true).build());
            field1.addImage(com.example.footballbooking.entity.FieldImage.builder().imageUrl("https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80").isPrimary(false).build());
            fieldRepository.save(field1);

            // Sân 2: Sân bóng Mini K300 (Sân 5)
            com.example.footballbooking.entity.FootballField field2 = com.example.footballbooking.entity.FootballField.builder()
                    .owner(chusan)
                    .name("Sân bóng Mini K300 Cộng Hòa")
                    .description("Cụm 4 sân 5 người mặt cỏ êm ái, thoát nước cực tốt khi trời mưa. Nằm ngay khu vực trung tâm, thuận tiện tụ tập giao lưu bóng đá phong trào.")
                    .address("A75 Bạch Đằng, Phường 2")
                    .district("Quận Tân Bình")
                    .city("Hồ Chí Minh")
                    .fieldType(com.example.footballbooking.entity.FieldType.SAN_5)
                    .basePrice(220000L)
                    .status(com.example.footballbooking.entity.FieldStatus.ACTIVE)
                    .ratingAverage(4.7)
                    .totalReviews(18)
                    .facilities(allFacs)
                    .bankName("Techcombank")
                    .bankAccountNumber("1903678910")
                    .bankAccountName("NGUYEN VAN CHU SAN")
                    .build();
            field2.addImage(com.example.footballbooking.entity.FieldImage.builder().imageUrl("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80").isPrimary(true).build());
            fieldRepository.save(field2);

            // Sân 3: Sân bóng Thể thao Mỹ Đình (Sân 11)
            com.example.footballbooking.entity.FootballField field3 = com.example.footballbooking.entity.FootballField.builder()
                    .owner(chusan)
                    .name("Trung tâm Bóng đá Mỹ Đình Sport")
                    .description("Sân bóng 11 người tiêu chuẩn thi đấu quốc gia, có thể chia thành 3 sân 7 người. Mặt cỏ sợi đan công nghệ mới, phòng tắm nóng lạnh đầy đủ.")
                    .address("Đường Lê Đức Thọ, Phường Mỹ Đình 1")
                    .district("Quận Nam Từ Liêm")
                    .city("Hà Nội")
                    .fieldType(com.example.footballbooking.entity.FieldType.SAN_11)
                    .basePrice(800000L)
                    .status(com.example.footballbooking.entity.FieldStatus.ACTIVE)
                    .ratingAverage(4.8)
                    .totalReviews(35)
                    .facilities(allFacs)
                    .bankName("Vietcombank")
                    .bankAccountNumber("001100456789")
                    .bankAccountName("NGUYEN VAN CHU SAN")
                    .build();
            field3.addImage(com.example.footballbooking.entity.FieldImage.builder().imageUrl("https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1200&q=80").isPrimary(true).build());
            fieldRepository.save(field3);

            // Sân 4: Sân bóng Cầu Giấy Arena (Sân 7 - Chờ duyệt để test admin approve)
            com.example.footballbooking.entity.FootballField field4 = com.example.footballbooking.entity.FootballField.builder()
                    .owner(chusan)
                    .name("Sân cỏ nhân tạo Cầu Giấy Arena")
                    .description("Sân mới làm mặt cỏ mới 100%, chuẩn bị khai trương phục vụ các giải đấu phong trào sinh viên và doanh nghiệp.")
                    .address("Số 2 Duy Tân, Phường Dịch Vọng Hậu")
                    .district("Quận Cầu Giấy")
                    .city("Hà Nội")
                    .fieldType(com.example.footballbooking.entity.FieldType.SAN_7)
                    .basePrice(300000L)
                    .status(com.example.footballbooking.entity.FieldStatus.PENDING_APPROVAL)
                    .ratingAverage(5.0)
                    .totalReviews(0)
                    .facilities(allFacs)
                    .bankName("ACB")
                    .bankAccountNumber("28282828")
                    .bankAccountName("NGUYEN VAN CHU SAN")
                    .build();
            field4.addImage(com.example.footballbooking.entity.FieldImage.builder().imageUrl("https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80").isPrimary(true).build());
            fieldRepository.save(field4);
        }
    }
}
