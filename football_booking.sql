-- MySQL dump 10.13  Distrib 8.4.3, for Win64 (x86_64)
--
-- Host: localhost    Database: football_booking
-- ------------------------------------------------------
-- Server version	8.4.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `football_booking`
--

/*!40000 DROP DATABASE IF EXISTS `football_booking`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `football_booking` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `football_booking`;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `booking_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `booking_date` date NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `customer_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `end_time` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `start_time` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('CANCELLED','COMPLETED','CONFIRMED','PENDING','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_price` bigint NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `field_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKq97166k18hklq6ls46osbrftx` (`booking_code`),
  KEY `idx_booking_code` (`booking_code`),
  KEY `idx_booking_user` (`user_id`),
  KEY `idx_booking_field_date` (`field_id`,`booking_date`),
  KEY `idx_booking_slot_check` (`field_id`,`booking_date`,`start_time`,`status`),
  CONSTRAINT `FK8eqtsqms4x56hwwe9ro8psvce` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`),
  CONSTRAINT `FKeyog2oic85xg7hsu2je2lx3s6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'#BK-20261001-4840','2026-10-01','2026-09-21 21:41:38.689440','Người Đặt Thứ Nhất','0911223344','20:30',NULL,'19:00','PENDING',420000,'2026-09-21 21:41:38.689440',1,4),(2,'#BK-TEST-PENDING','2026-09-21','2026-09-21 21:45:36.496784',NULL,NULL,'07:30',NULL,'06:00','PENDING',200000,'2026-09-21 21:45:36.496784',1,4),(4,'#BK-20420110-8246','2042-01-10','2026-09-21 21:51:40.644707','Người Đặt Thứ Nhất','0911223344','20:30',NULL,'19:00','PENDING',420000,'2026-09-21 21:51:40.644707',1,4),(5,'#BK-TEST-1790002300864','2027-04-09','2026-09-21 21:51:40.865044',NULL,NULL,'07:30',NULL,'06:00','PENDING',200000,'2026-09-21 21:51:40.865044',1,4),(6,'#BK-20371119-7525','2037-11-19','2026-09-21 21:52:13.263772','Người Đặt Thứ Nhất','0911223344','20:30',NULL,'19:00','PENDING',420000,'2026-09-21 21:52:13.263772',1,4),(7,'#BK-TEST-1790002333583','2027-04-09','2026-09-21 21:52:13.586890',NULL,NULL,'07:30',NULL,'06:00','PENDING',200000,'2026-09-21 21:52:13.586890',1,4),(8,'#BK-20260921-9013','2026-09-21','2026-09-21 21:59:39.167597','Lê Hoàng Đặt Sân','0934567890','16:00','','14:30','PENDING',800000,'2026-09-21 21:59:39.167597',3,4),(9,'#BK-20260921-5236','2026-09-21','2026-09-21 22:10:17.084128','Nguyễn Văn Chủ Sân','0912345678','09:00','','07:30','PENDING',350000,'2026-09-21 22:10:17.084128',1,2),(10,'#BK-20450123-5168','2045-01-23','2026-09-21 22:23:25.277825','Người Đặt Thứ Nhất','0911223344','20:30',NULL,'19:00','PENDING',420000,'2026-09-21 22:23:25.277825',1,4),(11,'#BK-TEST-1790004205574','2027-04-09','2026-09-21 22:23:25.575681',NULL,NULL,'07:30',NULL,'06:00','PENDING',200000,'2026-09-21 22:23:25.575681',1,4);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facilities`
--

DROP TABLE IF EXISTS `facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facilities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `icon_key` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6tm0w2xajnx3l566muxq8apmq` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facilities`
--

LOCK TABLES `facilities` WRITE;
/*!40000 ALTER TABLE `facilities` DISABLE KEYS */;
INSERT INTO `facilities` VALUES (1,'Lightbulb','Chiếu sáng ban đêm'),(2,'Wifi','Wifi miễn phí'),(3,'Car','Bãi giữ xe rộng rãi'),(4,'Coffee','Căn tin nước giải khát'),(5,'Shirt','Phòng thay đồ & tắm'),(6,'Trophy','Cho thuê bóng & áo đấu');
/*!40000 ALTER TABLE `facilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `field_facilities`
--

DROP TABLE IF EXISTS `field_facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `field_facilities` (
  `field_id` bigint NOT NULL,
  `facility_id` bigint NOT NULL,
  PRIMARY KEY (`field_id`,`facility_id`),
  KEY `FKd35i5mk3ohcx5fq5f27itubfo` (`facility_id`),
  CONSTRAINT `FKd35i5mk3ohcx5fq5f27itubfo` FOREIGN KEY (`facility_id`) REFERENCES `facilities` (`id`),
  CONSTRAINT `FKs9qmf1h80qq4a3wrxs1xxsj7u` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `field_facilities`
--

LOCK TABLES `field_facilities` WRITE;
/*!40000 ALTER TABLE `field_facilities` DISABLE KEYS */;
INSERT INTO `field_facilities` VALUES (1,1),(2,1),(3,1),(4,1),(1,2),(2,2),(3,2),(4,2),(1,3),(2,3),(3,3),(4,3),(1,4),(2,4),(3,4),(4,4),(1,5),(2,5),(3,5),(4,5),(1,6),(2,6),(3,6),(4,6);
/*!40000 ALTER TABLE `field_facilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `field_images`
--

DROP TABLE IF EXISTS `field_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `field_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_primary` bit(1) NOT NULL,
  `field_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3qj5p3njvo0xsv9ktv2n0trdo` (`field_id`),
  CONSTRAINT `FK3qj5p3njvo0xsv9ktv2n0trdo` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `field_images`
--

LOCK TABLES `field_images` WRITE;
/*!40000 ALTER TABLE `field_images` DISABLE KEYS */;
INSERT INTO `field_images` VALUES (1,'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',_binary '',1),(2,'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',_binary '\0',1),(3,'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',_binary '',2),(4,'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1200&q=80',_binary '',3),(5,'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80',_binary '',4);
/*!40000 ALTER TABLE `field_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `field_time_slots`
--

DROP TABLE IF EXISTS `field_time_slots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `field_time_slots` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `end_time` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` bit(1) NOT NULL,
  `price` bigint NOT NULL,
  `start_time` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `field_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_slot_field` (`field_id`),
  CONSTRAINT `FKf03xq0wnd98yf7b2t0svcicoe` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `field_time_slots`
--

LOCK TABLES `field_time_slots` WRITE;
/*!40000 ALTER TABLE `field_time_slots` DISABLE KEYS */;
/*!40000 ALTER TABLE `field_time_slots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fields`
--

DROP TABLE IF EXISTS `fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fields` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `base_price` bigint NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `field_type` enum('SAN_11','SAN_5','SAN_7') COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating_average` double NOT NULL,
  `status` enum('ACTIVE','INACTIVE','PENDING_APPROVAL','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_reviews` int NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `owner_id` bigint NOT NULL,
  `bank_account_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_account_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_field_status` (`status`),
  KEY `idx_field_city` (`city`),
  KEY `idx_field_district` (`district`),
  KEY `idx_field_type` (`field_type`),
  KEY `idx_field_price` (`base_price`),
  KEY `FK6dy77o0y2kysxqpnb0trdm4vh` (`owner_id`),
  CONSTRAINT `FK6dy77o0y2kysxqpnb0trdm4vh` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fields`
--

LOCK TABLES `fields` WRITE;
/*!40000 ALTER TABLE `fields` DISABLE KEYS */;
INSERT INTO `fields` VALUES (1,'30 Phan Thúc Duyện, Phường 4',350000,'Hồ Chí Minh','2026-09-21 21:34:17.978499','Sân cỏ nhân tạo chất lượng cao nhập khẩu từ Ý, hệ thống đèn LED chống chói chuẩn thi đấu, bãi đỗ xe ô tô và xe máy rộng rãi có mái che.','Quận Tân Bình','SAN_7','Sân bóng Chảo Lửa Tân Bình',4.9,'ACTIVE',24,'2026-09-21 21:34:17.979500',2,'NGUYEN VAN CHU SAN','0912345678','MBBank'),(2,'A75 Bạch Đằng, Phường 2',220000,'Hồ Chí Minh','2026-09-21 21:34:18.020044','Cụm 4 sân 5 người mặt cỏ êm ái, thoát nước cực tốt khi trời mưa. Nằm ngay khu vực trung tâm, thuận tiện tụ tập giao lưu bóng đá phong trào.','Quận Tân Bình','SAN_5','Sân bóng Mini K300 Cộng Hòa',4.7,'ACTIVE',18,'2026-09-21 21:34:18.020044',2,'NGUYEN VAN CHU SAN','1903678910','Techcombank'),(3,'Đường Lê Đức Thọ, Phường Mỹ Đình 1',800000,'Hà Nội','2026-09-21 21:34:18.040948','Sân bóng 11 người tiêu chuẩn thi đấu quốc gia, có thể chia thành 3 sân 7 người. Mặt cỏ sợi đan công nghệ mới, phòng tắm nóng lạnh đầy đủ.','Quận Nam Từ Liêm','SAN_11','Trung tâm Bóng đá Mỹ Đình Sport',4.8,'ACTIVE',35,'2026-09-21 21:34:18.040948',2,'NGUYEN VAN CHU SAN','001100456789','Vietcombank'),(4,'Số 2 Duy Tân, Phường Dịch Vọng Hậu',300000,'Hà Nội','2026-09-21 21:34:18.057677','Sân mới làm mặt cỏ mới 100%, chuẩn bị khai trương phục vụ các giải đấu phong trào sinh viên và doanh nghiệp.','Quận Cầu Giấy','SAN_7','Sân cỏ nhân tạo Cầu Giấy Arena',5,'PENDING_APPROVAL',0,'2026-09-21 21:34:18.057677',2,NULL,NULL,NULL);
/*!40000 ALTER TABLE `fields` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `is_read` bit(1) NOT NULL,
  `message` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference_id` bigint DEFAULT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('BOOKING_CANCELLED','BOOKING_COMPLETED','BOOKING_CONFIRMED','BOOKING_CREATED','BOOKING_REJECTED','PAYMENT_FAILED','PAYMENT_SUCCESS') COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_noti_user` (`user_id`),
  KEY `idx_noti_read` (`is_read`),
  CONSTRAINT `FK9y21adhxn0ayjhfocscqox7bh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'2026-09-21 21:41:38.724395',_binary '\0','Bạn đã tạo đơn đặt sân Sân bóng Chảo Lửa Tân Bình lúc 19:00 ngày 01/10/2026',1,'Đặt sân thành công!','BOOKING_CREATED',4),(2,'2026-09-21 21:41:38.728445',_binary '\0','Có khách hàng vừa đặt sân Sân bóng Chảo Lửa Tân Bình lúc 19:00 (#BK-20261001-4840)',1,'Yêu cầu đặt sân mới','BOOKING_CREATED',2),(3,'2026-09-21 21:51:40.649725',_binary '\0','Bạn đã tạo đơn đặt sân Sân bóng Chảo Lửa Tân Bình lúc 19:00 ngày 10/01/2042',4,'Đặt sân thành công!','BOOKING_CREATED',4),(4,'2026-09-21 21:51:40.655266',_binary '\0','Có khách hàng vừa đặt sân Sân bóng Chảo Lửa Tân Bình lúc 19:00 (#BK-20420110-8246)',4,'Yêu cầu đặt sân mới','BOOKING_CREATED',2),(5,'2026-09-21 21:52:13.267475',_binary '\0','Bạn đã tạo đơn đặt sân Sân bóng Chảo Lửa Tân Bình lúc 19:00 ngày 19/11/2037',6,'Đặt sân thành công!','BOOKING_CREATED',4),(6,'2026-09-21 21:52:13.271466',_binary '\0','Có khách hàng vừa đặt sân Sân bóng Chảo Lửa Tân Bình lúc 19:00 (#BK-20371119-7525)',6,'Yêu cầu đặt sân mới','BOOKING_CREATED',2),(7,'2026-09-21 21:59:39.169585',_binary '\0','Bạn đã tạo đơn đặt sân Trung tâm Bóng đá Mỹ Đình Sport lúc 14:30 ngày 21/09/2026',8,'Đặt sân thành công!','BOOKING_CREATED',4),(8,'2026-09-21 21:59:39.173584',_binary '\0','Có khách hàng vừa đặt sân Trung tâm Bóng đá Mỹ Đình Sport lúc 14:30 (#BK-20260921-9013)',8,'Yêu cầu đặt sân mới','BOOKING_CREATED',2),(9,'2026-09-21 22:10:17.087148',_binary '\0','Bạn đã tạo đơn đặt sân Sân bóng Chảo Lửa Tân Bình lúc 07:30 ngày 21/09/2026',9,'Đặt sân thành công!','BOOKING_CREATED',2),(10,'2026-09-21 22:10:17.088154',_binary '\0','Có khách hàng vừa đặt sân Sân bóng Chảo Lửa Tân Bình lúc 07:30 (#BK-20260921-5236)',9,'Yêu cầu đặt sân mới','BOOKING_CREATED',2),(11,'2026-09-21 22:23:25.282404',_binary '\0','Bạn đã tạo đơn đặt sân Sân bóng Chảo Lửa Tân Bình lúc 19:00 ngày 23/01/2045',10,'Đặt sân thành công!','BOOKING_CREATED',4),(12,'2026-09-21 22:23:25.285309',_binary '\0','Có khách hàng vừa đặt sân Sân bóng Chảo Lửa Tân Bình lúc 19:00 (#BK-20450123-5168)',10,'Yêu cầu đặt sân mới','BOOKING_CREATED',2);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` bigint NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `payment_method` enum('CASH_AT_FIELD','MOMO','VIETQR','VNPAY') COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_time` datetime(6) DEFAULT NULL,
  `status` enum('FAILED','PENDING','SUCCESS') COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `booking_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK8inpv30544qjykcwa6ck7pusy` (`transaction_code`),
  UNIQUE KEY `UKnuscjm6x127hkb15kcb8n56wo` (`booking_id`),
  KEY `idx_payment_booking` (`booking_id`),
  KEY `idx_payment_user` (`user_id`),
  KEY `idx_payment_txn` (`transaction_code`),
  CONSTRAINT `FKc52o2b1jkxttngufqp3t7jr3h` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  CONSTRAINT `FKj94hgy9v5fw1munb90tar2eje` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expiry_date` datetime(6) NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKghpmfn23vmxfu3spu3lfg4r2d` (`token`),
  UNIQUE KEY `UK7tdcd6ab5wsgoudnvj7xf1b7l` (`user_id`),
  KEY `idx_token_value` (`token`),
  CONSTRAINT `FK1lih5y2npsf8u5o3vhdb9y0os` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,'2026-09-28 14:29:28.700085','aca4ea3b-023b-4689-b9f8-ebebcd4e3acc',5),(2,'2026-09-28 15:23:25.092643','b991f150-a8b1-430f-a8e3-bdac9c7ed9eb',1),(3,'2026-09-28 14:50:20.580615','b645902d-ec29-46b2-a739-1031fb3160ec',6),(5,'2026-09-28 14:51:40.241911','d37fe6f9-1c70-4120-a494-2812c08adaff',7),(6,'2026-09-28 14:52:12.881115','19defd12-b331-422e-8bbf-2641fba21e9d',8),(7,'2026-09-28 15:08:06.848911','ad615fbd-f89f-4e62-ada2-a1af0df7bb25',2),(8,'2026-09-28 14:59:33.072199','3b4d2b6b-eb4f-4e01-88ad-297fb6fd7fac',4),(9,'2026-09-28 15:02:31.335602','cc2f8719-50a3-46bf-971b-b5d96b98b8cf',9),(10,'2026-09-28 15:23:24.933071','3fc0347a-6c1d-4b34-aa94-3283e85a3e27',10);
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(6) NOT NULL,
  `rating` int NOT NULL,
  `booking_id` bigint NOT NULL,
  `field_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_review_booking` (`booking_id`),
  KEY `idx_review_field` (`field_id`),
  KEY `FKcgy7qjc1r99dp117y9en6lxye` (`user_id`),
  CONSTRAINT `FK28an517hrxtt2bsg93uefugrm` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  CONSTRAINT `FKcgy7qjc1r99dp117y9en6lxye` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKegdujnq8eixuvt4fhla5y7sja` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `avatar_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('ROLE_ADMIN','ROLE_CHUSAN','ROLE_USER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('ACTIVE','LOCKED','PENDING','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  KEY `idx_user_email` (`email`),
  KEY `idx_user_role` (`role`),
  KEY `idx_user_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,'2026-09-21 21:29:27.785515','admin@football.vn','Quản Trị Viên Hệ Thống','$2a$10$r.13RNFb2ESLOfyPKom4Oer.25AnMqIjFFkcIwnJDEF0FFjBfpmWa','0901234567','ROLE_ADMIN','ACTIVE','2026-09-21 21:29:27.785515'),(2,NULL,'2026-09-21 21:29:27.888567','chusan@football.vn','Nguyễn Văn Chủ Sân','$2a$10$sVfthwyvygVEEcHe1XnD8OM39NDUddY4P5tBy015BXlTMR.8dFWJS','0912345678','ROLE_CHUSAN','ACTIVE','2026-09-21 21:29:27.888567'),(3,NULL,'2026-09-21 21:29:27.958667','chusan_moi@football.vn','Trần Đình Mới Đăng Ký','$2a$10$EkZqzNpvTKMoXgcx9CJBK.M4/tPuI8Slk.IRkFNWmaLiBrl7vc/96','0923456789','ROLE_CHUSAN','PENDING','2026-09-21 21:29:27.958667'),(4,NULL,'2026-09-21 21:29:28.035848','user@football.vn','Lê Hoàng Đặt Sân','$2a$10$tMUWfc9Svsi.u8reMchJreL476zMHkv8gH0jJtgrooG/X/nbruBBq','0934567890','ROLE_USER','ACTIVE','2026-09-21 21:29:28.035848'),(5,NULL,'2026-09-21 21:29:28.636742','test_khachhang_1790000968416@gmail.com','Nguyễn Khách Mới','$2a$10$.dCtpwQ15Ds7/JQJHqw9cOPY.4gFKITyuz6MFZFEy18bPfI1qZuGK','0987654321','ROLE_USER','ACTIVE','2026-09-21 21:29:28.636742'),(6,NULL,'2026-09-21 21:50:20.406751','test_khachhang_1790002220113@gmail.com','Nguyễn Khách Mới','$2a$10$7/lYy6ZXJ59S7brAV81FMOo8nSLISrGyrmf37RsrYL/FLU2bmKDJq','0987654321','ROLE_USER','ACTIVE','2026-09-21 21:50:20.406751'),(7,NULL,'2026-09-21 21:51:40.101183','test_khachhang_1790002299850@gmail.com','Nguyễn Khách Mới','$2a$10$CKw4BA.2RnUjifwJ3bN2Zuufs4L/byv6wrQ1E/.g8YGmgHuRQFGGi','0987654321','ROLE_USER','ACTIVE','2026-09-21 21:51:40.101183'),(8,NULL,'2026-09-21 21:52:12.760588','test_khachhang_1790002332502@gmail.com','Nguyễn Khách Mới','$2a$10$yHM4ibyGwnNNnFqR7J07t.TR0iRit/Eid0LQLR6tH7RWb3Qh3WKBO','0987654321','ROLE_USER','ACTIVE','2026-09-21 21:52:12.760588'),(9,NULL,'2026-09-21 22:02:31.332580','lollll@gmail.com','vi hung','$2a$10$j79EEr6e3/6oV5qMgTeSTufXqX8kfjCB4kUezKRTjpCbY2uRkTQ4a','0393333333','ROLE_USER','ACTIVE','2026-09-21 22:02:31.332580'),(10,NULL,'2026-09-21 22:23:24.847963','test_khachhang_1790004204596@gmail.com','Nguyễn Khách Mới','$2a$10$7Qtw1Ypsv/tMq5RmbBW6JOMEfQfQYIrH2Uvyb1fnX.kyiPrX2u0im','0987654321','ROLE_USER','ACTIVE','2026-09-21 22:23:24.847963');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-21 22:26:22
