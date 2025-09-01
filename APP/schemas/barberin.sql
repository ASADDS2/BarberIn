-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: barberin
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointments`
--
CREATE DATABASE Barberin;
USE Barberin;

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `appointment_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `barber_id` int NOT NULL,
  `barbershop_id` int NOT NULL,
  `service_id` int DEFAULT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `status` enum('pending','confirmed','in_progress','completed','cancelled','no_show') DEFAULT 'pending',
  `total_price` decimal(10,2) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`appointment_id`),
  KEY `barbershop_id` (`barbershop_id`),
  KEY `service_id` (`service_id`),
  KEY `idx_appointments_date` (`appointment_date`),
  KEY `idx_appointments_user` (`user_id`),
  KEY `idx_appointments_barber` (`barber_id`),
  CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`barber_id`) REFERENCES `barbers` (`barber_id`) ON DELETE CASCADE,
  CONSTRAINT `appointments_ibfk_3` FOREIGN KEY (`barbershop_id`) REFERENCES `barbershops` (`barbershop_id`) ON DELETE CASCADE,
  CONSTRAINT `appointments_ibfk_4` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `barber_availability`
--

DROP TABLE IF EXISTS `barber_availability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `barber_availability` (
  `availability_id` int NOT NULL AUTO_INCREMENT,
  `barber_id` int NOT NULL,
  `status` enum('available','busy','break','offline') DEFAULT 'available',
  `last_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`availability_id`),
  UNIQUE KEY `unique_barber_availability` (`barber_id`),
  CONSTRAINT `barber_availability_ibfk_1` FOREIGN KEY (`barber_id`) REFERENCES `barbers` (`barber_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `barber_availability`
--

LOCK TABLES `barber_availability` WRITE;
/*!40000 ALTER TABLE `barber_availability` DISABLE KEYS */;
INSERT INTO `barber_availability` VALUES (1,1,'available','2025-09-01 00:30:53');
/*!40000 ALTER TABLE `barber_availability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `barber_portfolio`
--

DROP TABLE IF EXISTS `barber_portfolio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `barber_portfolio` (
  `portfolio_id` int NOT NULL AUTO_INCREMENT,
  `barber_id` int NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `description` text,
  `haircut_type` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`portfolio_id`),
  KEY `barber_id` (`barber_id`),
  CONSTRAINT `barber_portfolio_ibfk_1` FOREIGN KEY (`barber_id`) REFERENCES `barbers` (`barber_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `barber_portfolio`
--

LOCK TABLES `barber_portfolio` WRITE;
/*!40000 ALTER TABLE `barber_portfolio` DISABLE KEYS */;
/*!40000 ALTER TABLE `barber_portfolio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `barber_schedules`
--

DROP TABLE IF EXISTS `barber_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `barber_schedules` (
  `schedule_id` int NOT NULL AUTO_INCREMENT,
  `barber_id` int NOT NULL,
  `day_of_week` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`schedule_id`),
  UNIQUE KEY `unique_barber_day` (`barber_id`,`day_of_week`),
  CONSTRAINT `barber_schedules_ibfk_1` FOREIGN KEY (`barber_id`) REFERENCES `barbers` (`barber_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `barber_schedules`
--

LOCK TABLES `barber_schedules` WRITE;
/*!40000 ALTER TABLE `barber_schedules` DISABLE KEYS */;
INSERT INTO `barber_schedules` VALUES (1,1,'Monday','07:00:00','22:00:00',1);
/*!40000 ALTER TABLE `barber_schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `barbers`
--

DROP TABLE IF EXISTS `barbers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `barbers` (
  `barber_id` int NOT NULL AUTO_INCREMENT,
  `barbershop_id` int NOT NULL,
  `name` varchar(200) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `description` text,
  `specialties` text,
  `qualification` varchar(100) DEFAULT NULL,
  `profile_photo_url` varchar(500) DEFAULT NULL,
  `rating_average` decimal(3,2) DEFAULT '0.00',
  `total_reviews` int DEFAULT '0',
  `ranking_position` int DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`barber_id`),
  KEY `idx_barbers_barbershop` (`barbershop_id`),
  CONSTRAINT `barbers_ibfk_1` FOREIGN KEY (`barbershop_id`) REFERENCES `barbershops` (`barbershop_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `barbers`
--

LOCK TABLES `barbers` WRITE;
/*!40000 ALTER TABLE `barbers` DISABLE KEYS */;
INSERT INTO `barbers` VALUES (1,1,'Carlos Mendoza',NULL,NULL,'Barbero con 10 años de experiencia','Cortes clásicos, barba','Técnico en barbería',NULL,0.00,0,NULL,1,'2025-09-01 00:30:52','2025-09-01 00:30:52',1);
/*!40000 ALTER TABLE `barbers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `barbershops`
--

DROP TABLE IF EXISTS `barbershops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `barbershops` (
  `barbershop_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `responsible_person` varchar(200) NOT NULL,
  `id_document` varchar(50) NOT NULL,
  `owner_phone` varchar(20) DEFAULT NULL,
  `profile_photo_url` varchar(500) DEFAULT NULL,
  `cover_photo_url` varchar(500) DEFAULT NULL,
  `description` text,
  `rating_average` decimal(3,2) DEFAULT '0.00',
  `total_reviews` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`barbershop_id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_barbershops_location` (`latitude`,`longitude`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `barbershops`
--

LOCK TABLES `barbershops` WRITE;
/*!40000 ALTER TABLE `barbershops` DISABLE KEYS */;
INSERT INTO `barbershops` VALUES (1,'Barbería Clásica','info@barberiaclasica.com','+573001234567','hash_example','Calle 45 #23-15, Barranquilla',NULL,NULL,'Juan Pérez','12345678','+573001234567',NULL,NULL,NULL,0.00,0,'2025-09-01 00:30:52','2025-09-01 00:30:52',1);
/*!40000 ALTER TABLE `barbershops` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `barbershop_id` int NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int DEFAULT '0',
  `category` varchar(100) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  KEY `barbershop_id` (`barbershop_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`barbershop_id`) REFERENCES `barbershops` (`barbershop_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `appointment_id` int NOT NULL,
  `user_id` int NOT NULL,
  `barber_id` int NOT NULL,
  `barbershop_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  UNIQUE KEY `unique_review_per_appointment` (`appointment_id`),
  KEY `user_id` (`user_id`),
  KEY `barber_id` (`barber_id`),
  KEY `barbershop_id` (`barbershop_id`),
  KEY `idx_reviews_rating` (`rating`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`appointment_id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`barber_id`) REFERENCES `barbers` (`barber_id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_4` FOREIGN KEY (`barbershop_id`) REFERENCES `barbershops` (`barbershop_id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `service_id` int NOT NULL AUTO_INCREMENT,
  `barbershop_id` int NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `duration_minutes` int NOT NULL,
  `category` enum('haircut','beard','styling','treatment','product') DEFAULT 'haircut',
  `image_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`service_id`),
  KEY `barbershop_id` (`barbershop_id`),
  CONSTRAINT `services_ibfk_1` FOREIGN KEY (`barbershop_id`) REFERENCES `barbershops` (`barbershop_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,1,'Corte Clásico','Corte de cabello tradicional',25000.00,45,'haircut',NULL,1,'2025-09-01 00:30:53');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_favorites`
--

DROP TABLE IF EXISTS `user_favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_favorites` (
  `favorite_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `barbershop_id` int DEFAULT NULL,
  `barber_id` int DEFAULT NULL,
  `favorite_type` enum('barbershop','barber') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`favorite_id`),
  UNIQUE KEY `unique_user_favorite` (`user_id`,`barbershop_id`,`barber_id`,`favorite_type`),
  KEY `barbershop_id` (`barbershop_id`),
  KEY `barber_id` (`barber_id`),
  CONSTRAINT `user_favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `user_favorites_ibfk_2` FOREIGN KEY (`barbershop_id`) REFERENCES `barbershops` (`barbershop_id`) ON DELETE CASCADE,
  CONSTRAINT `user_favorites_ibfk_3` FOREIGN KEY (`barber_id`) REFERENCES `barbers` (`barber_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_favorites`
--

LOCK TABLES `user_favorites` WRITE;
/*!40000 ALTER TABLE `user_favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `address` text,
  `age_range` enum('18-25','26-35','36-45','46+') DEFAULT NULL,
  `profile_photo_url` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  `google_id` varchar(255) DEFAULT NULL,
  `provider` varchar(50) DEFAULT 'local',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `google_id` (`google_id`),
  KEY `idx_users_google_id` (`google_id`),
  KEY `idx_users_provider` (`provider`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'yesid','castro','yesid@gmail.com','3000000000','yesid123','calle por la clara','18-25',NULL,'2025-09-01 03:22:03','2025-09-01 03:22:03',1,NULL,''),(2,'Sebastian','Arnache','dda@gmail.com','3000022520','$2b$10$epEaSABLH5/qcNbOAVFceeduMsmCILHuFLSw6IMbprleR4VYeN6iG','Calle 45 n56','18-25',NULL,'2025-09-01 14:19:36','2025-09-01 14:19:36',1,NULL,''),(3,'yesid','castro','y@g.com','3000000000','$2b$10$EwNrfyx9z/8vaonTGhO1wuoH5yzu1yGcW5CHJQU2OhZtffcbfCzzm','calle 0000000','18-25',NULL,'2025-09-01 14:30:57','2025-09-01 14:30:57',1,NULL,''),(4,'yiss','guti','yiss@gmail.com','30000000000','$2b$10$JqHFVDrzFeft7cfzxHXwpurMgyvMCm8HFWlhF3aNLJm/YSEyLxURG','calee123456','18-25',NULL,'2025-09-01 16:06:29','2025-09-01 16:06:29',1,NULL,''),(5,'Xsas','dsa','das@gmail.com','3000000000','$2b$10$/fULcgcn2XumsncBYzLqEuuB8HE99nxP/4AMmCNV0TX4ERN88y2DK','Calle 55','18-25',NULL,'2025-09-01 16:32:29','2025-09-01 16:32:29',1,NULL,''),(7,'Yesid','Castro','castrogil202@gmail.com',NULL,NULL,NULL,NULL,'https://lh3.googleusercontent.com/a/ACg8ocKQhddEAnEODN0xbAYRZ7w2fWXFFMQsfKgZXtTpMTymclZlnlo=s96-c','2025-09-01 17:59:39','2025-09-01 17:59:39',1,'100523192908077506318','google'),(8,'Sebastian','Arnache Cantillo','sarnachecantillo@gmail.com',NULL,NULL,NULL,NULL,'https://lh3.googleusercontent.com/a/ACg8ocJFGuMmdkPvKE6ev2DaVU2OVAqIkUUb2i24Be_kfrqhnrciVcA=s96-c','2025-09-01 18:26:18','2025-09-01 18:26:18',1,'114709632510569561680','google'),(9,'juan','arcnache','ar@a.com','3123456789','$2b$10$b2rR4FSgxZCSTjkR6WyrrO3mlVy.Gwp7QUY8MGGXoLwx/qQg.AHcu','calle123456','18-25',NULL,'2025-09-01 18:32:25','2025-09-01 18:32:25',1,NULL,'local');
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

-- Dump completed on 2025-09-01 15:52:29
