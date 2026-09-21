# HỆ THỐNG QUẢN LÝ VÀ ĐẶT LỊCH SÂN BÓNG ĐÁ TRỰC TUYẾN
> Hệ thống web full-stack đặt lịch sân bóng đá hiện đại, hỗ trợ 3 nhóm đối tượng: Khách hàng (USER), Đối tác Chủ sân (CHUSAN) và Ban quản trị (ADMIN).
> Thiết kế theo tiêu chuẩn Việt Nam hóa (vi-VN, Asia/Ho_Chi_Minh, VND), giao diện phản hồi linh hoạt (Mobile First), bảo vệ chống đặt trùng sân (Anti-Double-Booking Serializable) và tuân thủ 30 quy tắc kiểm định chất lượng mã nguồn Alibaba OpenCodeReview.

---

## MỤC LỤC
1. [Giới thiệu tổng quan](#1-giới-thiệu-tổng-quan)
2. [Tính năng theo 3 Actor](#2-tính-năng-theo-3-actor)
3. [Kiến trúc hệ thống](#3-kiến-trúc-hệ-thống)
4. [Công nghệ sử dụng](#4-công-nghệ-sử-dụng)
5. [Tài khoản Demo hệ thống](#5-tài-khoản-demo-hệ-thống)
6. [Cấu hình môi trường & Database](#6-cấu-hình-môi-trường--database)
7. [Hướng dẫn khởi chạy Backend & Frontend](#7-hướng-dẫn-khởi-chạy-backend--frontend)
8. [Tài liệu API Swagger](#8-tài-liệu-api-swagger)
9. [Kiểm thử tự động (Automated Testing)](#9-kiểm-thử-tự-động-automated-testing)
10. [Tuân thủ tiêu chuẩn Alibaba OpenCodeReview](#10-tuân-thủ-tiêu-chuẩn-alibaba-opencodereview)

---

## 1. GIỚI THIỆU TỔNG QUAN
Hệ thống giải quyết bài toán quản lý, tìm kiếm và đặt lịch sân cỏ nhân tạo theo thời gian thực:
- **Ngôn ngữ & Locale**: 100% Tiếng Việt, locale `vi-VN`, múi giờ `Asia/Ho_Chi_Minh` (UTC+7).
- **Định dạng chuẩn**: Ngày `dd/MM/yyyy`, giờ `HH:mm` (chuẩn 24 giờ, không dùng AM/PM), tiền tệ Việt Nam Đồng (`formatCurrency(150000)` hiển thị `150.000 ₫`).
- **Giao diện**: Responsive trên mọi kích thước (375px, 768px, 1024px, 1440px), hỗ trợ chế độ Sáng / Tối / Hệ thống (`Light / Dark / System Mode`) thông qua `next-themes`, 100% sử dụng Lucide Icons (không dùng Emoji).

---

## 2. TÍNH NĂNG THEO 3 ACTOR

### 1. Khách hàng (ROLE_USER)
- **Đăng ký / Đăng nhập / JWT Token**: Xác thực an toàn, tự động cấp phát và làm mới Access Token / Refresh Token.
- **Tìm kiếm sân thông minh**: Lọc sân theo địa điểm (Quận/Huyện, Tỉnh/TP), loại sân (sân 5, 7, 11), mức giá, đánh giá sao, debounce khi nhập tìm kiếm.
- **Xem chi tiết sân**: Xem bộ sưu tập hình ảnh sân, danh sách tiện ích (đèn chiếu sáng, bãi xe, phòng tắm, wifi...), bảng giá giờ cao điểm và đánh giá từ cộng đồng.
- **Đặt sân đa bước (Stepper UI)**:
  1. Chọn ngày thi đấu (Date Picker chuẩn tiếng Việt)
  2. Chọn khung giờ trống (06:00 - 22:30, hiển thị trạng thái `AVAILABLE`, `BOOKED`, `BLOCKED`)
  3. Xác nhận thông tin và kiểm tra bảng giá (Giá do Backend tự tính toán độc lập)
  4. Thanh toán mô phỏng VietQR / Chuyển khoản ngân hàng & Nhận vé điện tử có mã QR
- **Lịch sử đặt sân & Vé QR**: Bảng quản lý đơn đặt (Desktop) và Card list (Mobile), tính năng hủy lịch đặt trước giờ đấu kèm Dialog xác nhận.
- **Đánh giá sân bóng**: Chỉ khách hàng đã hoàn thành trận đấu (`COMPLETED`) mới được quyền chấm điểm từ 1 đến 5 sao và viết nhận xét chi tiết.
- **Trung tâm thông báo**: Nhận thông báo tự động khi đặt sân thành công, chủ sân xác nhận, chủ sân từ chối, hoặc thanh toán hoàn tất.

### 2. Chủ sân (ROLE_CHUSAN)
- **Báo cáo thống kê Dashboard**: Tổng số sân đang quản lý, số đơn đặt sân hôm nay, doanh thu hôm nay, doanh thu tháng và số lượng đơn đang chờ duyệt.
- **Quản lý danh sách sân bóng**: Đăng tải sân mới (gửi yêu cầu phê duyệt đến Quản trị viên), xem danh mục sân, xóa sân thuộc quyền sở hữu.
- **Xử lý đơn đặt sân**: Phê duyệt (`CONFIRMED`), từ chối (`REJECTED`), hoặc xác nhận hoàn thành trận đấu (`COMPLETED`) để ghi nhận doanh thu.
- **Lịch thi đấu (Calendar View)**: Theo dõi danh sách các khung giờ thi đấu theo từng ngày trên giao diện lịch trực quan; tự động chuyển sang dạng thẻ (Card Layout) trên thiết bị di động.

### 3. Quản trị viên (ROLE_ADMIN)
- **Bảng điều khiển toàn sàn**: Tổng khách hàng, tổng đối tác chủ sân, tổng số sân, tổng số lượt đặt, doanh thu toàn hệ thống và số lượng yêu cầu chờ thẩm định.
- **Kiểm duyệt đối tác Chủ sân**: Xem hồ sơ đăng ký mới (`PENDING`), phê duyệt tài khoản (`ACTIVE`) hoặc từ chối (`REJECTED`). Chỉ chủ sân đã được duyệt mới có quyền đăng sân.
- **Kiểm duyệt sân bóng**: Duyệt các sân bóng mới do chủ sân tạo (`PENDING_APPROVAL` -> `ACTIVE` / `REJECTED`). Khách hàng chỉ nhìn thấy các sân ở trạng thái `ACTIVE`.
- **Quản lý tài khoản**: Khóa (`LOCKED`) hoặc mở khóa (`ACTIVE`) tài khoản người dùng vi phạm quy định.
- **Giám sát toàn sàn**: Theo dõi toàn bộ đơn đặt sân và luồng giao dịch trên toàn hệ thống.

---

## 3. KIẾN TRÚC HỆ THỐNG

### Phân tầng Backend (Spring Boot Clean Architecture)
```
backend/
└── src/
    ├── main/java/com/example/footballbooking/
    │   ├── config/          # Cấu hình CORS, OpenAPI Swagger, Jackson VN Timezone
    │   ├── controller/      # REST Controllers (mỏng, không chứa business logic)
    │   ├── dto/             # Data Transfer Objects (Request / Response)
    │   ├── entity/          # JPA Entities (Hibernate, Indexes, Constraints)
    │   ├── exception/       # GlobalExceptionHandler chuẩn hóa RFC 7807 (không lộ stack trace)
    │   ├── mapper/          # Bộ chuyển đổi Entity sang DTO an toàn
    │   ├── repository/      # Spring Data JPA Repositories
    │   ├── security/        # Spring Security 6 + JJWT Filter + UserDetailsService
    │   └── service/         # Toàn bộ nghiệp vụ, Serializable Transaction & Locking
    └── test/                # Test suite tích hợp (Auth, Double Booking, Schedule, Stats)
```

### Cơ chế chống đặt trùng sân (Anti-Double-Booking Protection)
- Sử dụng `@Transactional(isolation = Isolation.SERIALIZABLE)` trong `BookingService.createBooking()`.
- Kiểm tra trực tiếp tại Database bằng phương thức `existsByFieldIdAndBookingDateAndStartTimeAndStatusIn()` trước khi ghi nhận đơn mới.
- Nếu 2 người dùng cố gắng đặt cùng 1 sân và 1 khung giờ cùng một lúc, hệ thống sẽ từ chối yêu cầu thứ hai ngay lập tức với mã lỗi `HTTP 409 Conflict` và thông báo tiếng Việt: *"Khung giờ này vừa có người đặt trước. Vui lòng chọn khung giờ khác!"*.

### Bảo vệ tính toàn vẹn giá tiền (Price Calculation Integrity)
- Backend không bao giờ tin tưởng giá tiền hay tổng tiền do frontend gửi lên.
- Frontend chỉ gửi: `{ fieldId, bookingDate, startTime, endTime }`.
- Backend tự truy vấn thông tin sân từ database, kiểm tra khung giờ và tự tính toán tổng tiền chính xác.

---

## 4. CÔNG NGHỆ SỬ DỤNG

### Frontend
- **Framework**: Next.js 16.3 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS (Mobile First, hỗ trợ Light/Dark mode qua CSS Variables)
- **Theme**: `next-themes`
- **Iconography**: 100% `lucide-react` (tuyệt đối không sử dụng ký tự emoji trong UI)
- **Thư viện UI**: Thiết kế theo chuẩn thẩm mỹ shadcn/ui (Button, Dialog, Badge, Skeleton, Toast...)
- **Định dạng tập trung**: `src/lib/utils/date.ts` (vi-VN, Asia/Ho_Chi_Minh), `src/lib/utils/currency.ts` (`formatCurrency`)

### Backend
- **Nền tảng**: Java 17 LTS
- **Framework**: Spring Boot 3.4.3
- **Bảo mật**: Spring Security 6 + JJWT (JSON Web Token 0.12.6)
- **Truy cập dữ liệu**: Spring Data JPA + Hibernate 6
- **Xác thực dữ liệu**: Jakarta Validation API (`@NotBlank`, `@Email`, `@Pattern`...)
- **Tài liệu API**: SpringDoc OpenAPI 2.8.5 (Swagger UI)
- **Quản lý build**: Apache Maven 3.9.9

### Cơ sở dữ liệu
- **Hệ quản trị**: MySQL 8.4 Community Server
- **Bộ ký tự**: `utf8mb4` / `utf8mb4_unicode_ci`

---

## 5. TÀI KHOẢN DEMO HỆ THỐNG
Hệ thống tự động khởi tạo sẵn các tài khoản demo khi khởi động (`DataSeeder`):

| Nhóm tài khoản | Email | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (ADMIN)** | `admin@football.vn` | `Admin@123` | Quản lý toàn sàn, duyệt chủ sân, duyệt sân, khóa tài khoản |
| **Chủ sân (CHUSAN)** | `chusan@football.vn` | `Chusan@123` | Quản lý cụm sân, duyệt/từ chối đơn, xem doanh thu ngày & tháng |
| **Khách hàng (USER)** | `user@football.vn` | `User@123` | Tìm sân, đặt lịch thi đấu, xem vé QR, gửi đánh giá hoàn thành |

> **Mẹo**: Tại trang đăng nhập (`/dang-nhap`), có sẵn các nút bấm chọn nhanh tài khoản demo giúp đăng nhập chỉ với 1 click!

---

## 6. CẤU HÌNH MÔI TRƯỜNG & DATABASE

### 1. Cơ sở dữ liệu MySQL
Tạo cơ sở dữ liệu `football_booking`:
```sql
CREATE DATABASE IF NOT EXISTS football_booking 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

### 2. Cấu hình Backend (`backend/src/main/resources/application.yml`)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/football_booking?useSSL=false&serverTimezone=Asia/Ho_Chi_Minh&allowPublicKeyRetrieval=true&characterEncoding=UTF-8
    username: root
    password: ""
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false

app:
  jwt:
    secret: "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"
    expiration-ms: 86400000       # 24 giờ
    refresh-expiration-ms: 604800000 # 7 ngày
```

---

## 7. HƯỚNG DẪN KHỞI CHẠY BACKEND & FRONTEND

### Khởi chạy Backend (Port 8080)
```powershell
cd backend
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:Path = "C:\Program Files\Java\jdk-17\bin;" + $env:Path
mvn spring-boot:run
```
Backend sẽ sẵn sàng tại: `http://localhost:8080`

### Khởi chạy Frontend (Port 3000)
```powershell
cd frontend
npm install
npm run dev
```
Giao diện người dùng sẽ sẵn sàng tại: `http://localhost:3000`

---

## 8. TÀI LIỆU API SWAGGER
Hệ thống tự động tạo giao diện tài liệu RESTful API tương tác qua OpenAPI:
- **Swagger UI**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

Tất cả các API tuân thủ tiền tố `/api/v1`:
- `/api/v1/auth/*`: Đăng ký, đăng nhập, làm mới token, lấy thông tin cá nhân
- `/api/v1/fields/*`: Tìm kiếm, bộ lọc sân công khai
- `/api/v1/bookings/*`: Đặt sân, xem lịch sử đặt sân, hủy đặt sân
- `/api/v1/owner/*`: Dashboard chỉ số chủ sân, duyệt/từ chối đơn, quản lý sân
- `/api/v1/admin/*`: Thống kê toàn sàn, duyệt đối tác, duyệt sân, quản lý người dùng
- `/api/v1/payments/*`: Tạo giao diện thanh toán mô phỏng VietQR
- `/api/v1/reviews/*`: Đánh giá chất lượng sân bóng cho đơn hoàn thành
- `/api/v1/notifications/*`: Danh sách thông báo, đánh dấu đã đọc

---

## 9. KIỂM THỬ TỰ ĐỘNG (AUTOMATED TESTING)
Hệ thống bao gồm 13 bài kiểm thử đơn vị và tích hợp toàn diện:
- `AuthControllerTest`: Kiểm tra đăng nhập đúng tài khoản, từ chối mật khẩu sai, đăng ký người dùng mới.
- `BookingConcurrencyTest`: Mô phỏng 2 yêu cầu đặt cùng một sân và một khung giờ cùng lúc; xác minh đơn thứ nhất được tạo thành công (HTTP 201) và đơn thứ hai bị từ chối với xung đột (HTTP 409 Conflict).
- `FieldControllerTest`: Kiểm tra danh sách sân công khai, chi tiết sân bóng.
- `ReviewAndNotificationTest`: Kiểm tra quy tắc chỉ cho phép đánh giá đơn đã hoàn thành, kiểm tra đếm thông báo chưa đọc.
- `DashboardAndAdminTest`: Kiểm tra thống kê chủ sân, thống kê quản trị viên, xác minh người dùng thường bị cấm truy cập API quản trị (HTTP 403 Forbidden).

Chạy toàn bộ test suite bằng Maven:
```powershell
cd backend
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:Path = "C:\Program Files\Java\jdk-17\bin;" + $env:Path
mvn test
```
**Kết quả**: `Tests run: 13, Failures: 0, Errors: 0, Skipped: 0 - BUILD SUCCESS`.

---

## 10. TUÂN THỦ TIÊU CHUẨN ALIBABA OPENCODEREVIEW
Dự án được quét và kiểm tra tự động thông qua script `scripts/alibaba_code_review.py`, đáp ứng đầy đủ 30 tiêu chuẩn nghiêm ngặt:
1. Controller không chứa business logic (chỉ điều hướng sang Service).
2. Business logic tập trung 100% tại Service layer.
3. Không expose JPA Entity trực tiếp ra ngoài API.
4. DTO được sử dụng cho toàn bộ dữ liệu Input / Output.
5. REST API đúng quy ước đặt tên URL và HTTP Method.
6. Sử dụng đúng mã HTTP status (200, 201, 400, 401, 403, 404, 409, 500).
7. Xác thực người dùng bằng JWT Token.
8. Phân quyền chặt chẽ với `@PreAuthorize`.
9. USER không thể truy cập tài nguyên của OWNER hoặc ADMIN.
10. CHUSAN chỉ có quyền thao tác trên sân và đơn hàng thuộc quyền sở hữu của mình.
11. Ngăn chặn đặt trùng sân (Anti-Double Booking) bằng kiểm tra database.
12. Giao dịch đặt sân sử dụng `@Transactional`.
13. Backend tự tính tiền, không tin cậy giá tiền gửi từ frontend.
14. Không hardcode bí mật nhạy cảm trong mã nguồn.
15. Không ghi nhật ký (log) mật khẩu hoặc token người dùng.
16. Validate toàn diện dữ liệu đầu vào với Jakarta Validation (`@Valid`).
17. Không trả stack trace kỹ thuật ra giao diện người dùng.
18. Phân trang (`Pageable`) cho tất cả các danh sách có khả năng tăng trưởng lớn.
19. Tối ưu hóa truy vấn cơ sở dữ liệu, tránh N+1 query.
20. Không có mã nguồn trùng lặp không cần thiết (áp dụng DRY).
21. Tách nhỏ component giao diện frontend theo từng tính năng chuyên biệt.
22. Không sử dụng ký tự Emoji/Unicode icons, 100% sử dụng Lucide Icons.
23. Giao diện người dùng phản hồi đa thiết bị (Mobile First, Tablet, Desktop).
24. Hỗ trợ đầy đủ 3 chế độ giao diện: Sáng (Light), Tối (Dark) và Tự động (System).
25. Ngày giờ và tính toán lịch đặt sử dụng múi giờ Việt Nam (`Asia/Ho_Chi_Minh`).
26. Toàn bộ ngôn ngữ hiển thị trên UI là Tiếng Việt chuẩn mực.
27. Toàn bộ chú thích trong mã nguồn (Code comment) được viết bằng Tiếng Việt.
28. Mã nguồn sạch sẽ, dễ đọc, dễ bảo trì và dễ mở rộng.
29. Thiết kế đơn giản, thực dụng, không over-engineering.
30. Không tạo các lớp abstraction trung gian vô nghĩa (như BaseController, BaseService rỗng).

Chạy script kiểm tra mã nguồn:
```powershell
python scripts/alibaba_code_review.py
```
**Kết quả**: `✓ TẤT CẢ 30 TIÊU CHUẨN ALIBABA OPENCODEREVIEW ĐÃ ĐẠT!`
