CREATE DATABASE barberian_db;
USE barberian_db;

SET FOREIGN_KEY_CHECKS = 0;

-- =========================
-- ROLES & GENRES
-- =========================
CREATE TABLE roles (
    id_role INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE genres (
    id_genre INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- =========================
-- AUTHENTICATION
-- =========================
CREATE TABLE auth_provider (
    id_auth_provider INT AUTO_INCREMENT PRIMARY KEY,
    provider ENUM('local','google') NOT NULL,
    provider_id_google VARCHAR(255),
    token VARCHAR(255)
);

CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NULL,
    id_role INT,
    FOREIGN KEY (id_role) REFERENCES roles(id_role)
);

CREATE TABLE user_auth_provider (
    id_user INT,
    id_auth_provider INT,
    PRIMARY KEY (id_user, id_auth_provider),
    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_auth_provider) REFERENCES auth_provider(id_auth_provider)
);

-- ===============================
-- LOCATIONS & BARBERSHOPS
-- ===============================
CREATE TABLE departments (
    id_department INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE citys (
    id_city INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    id_department INT NOT NULL,
    FOREIGN KEY (id_department) REFERENCES departments(id_department)
);

CREATE TABLE barbershops (
    id_barbershop INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(50)
);

CREATE TABLE locations (
    id_location INT AUTO_INCREMENT PRIMARY KEY,
    id_barbershop INT NOT NULL,
    id_department INT NOT NULL,
    id_city INT NOT NULL,
    address VARCHAR(255) NOT NULL,
    opening_hour TIME NOT NULL,
    closing_hour TIME NOT NULL,
    FOREIGN KEY (id_barbershop) REFERENCES barbershops(id_barbershop),
    FOREIGN KEY (id_department) REFERENCES departments(id_department),
    FOREIGN KEY (id_city) REFERENCES citys(id_city)
);

-- ==============================
-- STAFF & SPECIALTIES
-- ==============================
CREATE TABLE specialties (
    id_specialty INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    years_experience INT NULL
);

CREATE TABLE barber_schedule (
    id_schedule INT AUTO_INCREMENT PRIMARY KEY,
    day_of_week ENUM('monday','tuesday','wednesday','thursday','friday','saturday','sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);

CREATE TABLE barbers (
    id_barber INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_genre INT NOT NULL,
    id_barbershop INT NULL,
    id_specialty INT NULL,
    id_department INT NOT NULL,
    id_city INT NOT NULL,
    id_barber_schedule INT NULL,
    phone VARCHAR(255) NULL,
    direction VARCHAR(255) NULL,
    points INT NOT NULL DEFAULT 0,
    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_genre) REFERENCES genres(id_genre),
    FOREIGN KEY (id_barbershop) REFERENCES barbershops(id_barbershop),
    FOREIGN KEY (id_specialty) REFERENCES specialties(id_specialty),
    FOREIGN KEY (id_department) REFERENCES departments(id_department),
    FOREIGN KEY (id_city) REFERENCES citys(id_city),
    FOREIGN KEY (id_barber_schedule) REFERENCES barber_schedule(id_schedule)
);

CREATE TABLE staff (
    id_staff INT AUTO_INCREMENT PRIMARY KEY,
    id_barber INT NOT NULL,
    id_barbershop INT NOT NULL,
    FOREIGN KEY (id_barber) REFERENCES barbers(id_barber),
    FOREIGN KEY (id_barbershop) REFERENCES barbershops(id_barbershop)
);

-- ==============================
-- CUSTOMERS
-- ==============================
CREATE TABLE customers (
    id_customer INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_genre INT NOT NULL,
    phone VARCHAR(255) NULL,
    direction VARCHAR(255) NULL,
    id_department INT NOT NULL,
    id_city INT NOT NULL,
    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_genre) REFERENCES genres(id_genre),
    FOREIGN KEY (id_department) REFERENCES departments(id_department),
    FOREIGN KEY (id_city) REFERENCES citys(id_city)
);

-- ==============================
-- APPOINTMENTS
-- ==============================
CREATE TABLE appointment (
    id_appointment INT AUTO_INCREMENT PRIMARY KEY,
    id_customer INT NOT NULL,
    id_barber INT NOT NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('pending','confirmed','cancelled','done') DEFAULT 'pending',
    FOREIGN KEY (id_customer) REFERENCES customers(id_customer),
    FOREIGN KEY (id_barber) REFERENCES barbers(id_barber)
);

-- ==============================
-- INITIAL DATA
-- ==============================
-- Insert default roles
INSERT INTO roles (name) VALUES ('admin');
INSERT INTO roles (name) VALUES ('customer');
INSERT INTO roles (name) VALUES ('barber');

-- Insert genres
INSERT INTO genres (name) VALUES ('Male');
INSERT INTO genres (name) VALUES ('Female');
INSERT INTO genres (name) VALUES ('Other');

-- Insert default admin user (password: admin123)
INSERT INTO users (full_name, email, password_hash, id_role) VALUES 
('Administrator', 'admin@barberian.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Ft1ZWH4EjCqIFO5I2', 1);
-- The password hash corresponds to 'admin123' using bcrypt.
SET FOREIGN_KEY_CHECKS = 1;
