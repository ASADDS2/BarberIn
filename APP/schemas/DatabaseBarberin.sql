-- Database for BARBERIN application
-- Barbershop appointment booking system
CREATE DATABASE Barberin;
USE Barberin;

-- Users table (clients)
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    address TEXT,
    age_range ENUM('18-25', '26-35', '36-45', '46+'),
    profile_photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Barbershops table
CREATE TABLE barbershops (
    barbershop_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    responsible_person VARCHAR(200) NOT NULL,
    id_document VARCHAR(50) NOT NULL,
    owner_phone VARCHAR(20),
    profile_photo_url VARCHAR(500),
    cover_photo_url VARCHAR(500),
    description TEXT,
    rating_average DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Barbers table
CREATE TABLE barbers (
    barber_id INT PRIMARY KEY AUTO_INCREMENT,
    barbershop_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    description TEXT,
    specialties TEXT,
    qualification VARCHAR(100),
    profile_photo_url VARCHAR(500),
    rating_average DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    ranking_position INT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (barbershop_id) REFERENCES barbershops(barbershop_id) ON DELETE CASCADE
);

-- Barber schedules table
CREATE TABLE barber_schedules (
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    barber_id INT NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (barber_id) REFERENCES barbers(barber_id) ON DELETE CASCADE,
    UNIQUE KEY unique_barber_day (barber_id, day_of_week)
);

-- Services/products table
CREATE TABLE services (
    service_id INT PRIMARY KEY AUTO_INCREMENT,
    barbershop_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_minutes INT NOT NULL,
    category ENUM('haircut', 'beard', 'styling', 'treatment', 'product') DEFAULT 'haircut',
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (barbershop_id) REFERENCES barbershops(barbershop_id) ON DELETE CASCADE
);

-- Appointments table
CREATE TABLE appointments (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    barber_id INT NOT NULL,
    barbershop_id INT NOT NULL,
    service_id INT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'pending',
    total_price DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (barber_id) REFERENCES barbers(barber_id) ON DELETE CASCADE,
    FOREIGN KEY (barbershop_id) REFERENCES barbershops(barbershop_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE SET NULL
);

-- Reviews/ratings table
CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT NOT NULL,
    user_id INT NOT NULL,
    barber_id INT NOT NULL,
    barbershop_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (barber_id) REFERENCES barbers(barber_id) ON DELETE CASCADE,
    FOREIGN KEY (barbershop_id) REFERENCES barbershops(barbershop_id) ON DELETE CASCADE,
    UNIQUE KEY unique_review_per_appointment (appointment_id)
);

-- User favorites table
CREATE TABLE user_favorites (
    favorite_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    barbershop_id INT,
    barber_id INT,
    favorite_type ENUM('barbershop', 'barber') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (barbershop_id) REFERENCES barbershops(barbershop_id) ON DELETE CASCADE,
    FOREIGN KEY (barber_id) REFERENCES barbers(barber_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_favorite (user_id, barbershop_id, barber_id, favorite_type)
);

-- Barber portfolio/gallery table
CREATE TABLE barber_portfolio (
    portfolio_id INT PRIMARY KEY AUTO_INCREMENT,
    barber_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    description TEXT,
    haircut_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (barber_id) REFERENCES barbers(barber_id) ON DELETE CASCADE
);

-- Barbershop products table
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    barbershop_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    category VARCHAR(100),
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (barbershop_id) REFERENCES barbershops(barbershop_id) ON DELETE CASCADE
);

-- Real-time barber availability table
CREATE TABLE barber_availability (
    availability_id INT PRIMARY KEY AUTO_INCREMENT,
    barber_id INT NOT NULL,
    status ENUM('available', 'busy', 'break', 'offline') DEFAULT 'available',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (barber_id) REFERENCES barbers(barber_id) ON DELETE CASCADE,
    UNIQUE KEY unique_barber_availability (barber_id)
);

-- Indexes for optimization
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_user ON appointments(user_id);
CREATE INDEX idx_appointments_barber ON appointments(barber_id);
CREATE INDEX idx_barbershops_location ON barbershops(latitude, longitude);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_barbers_barbershop ON barbers(barbershop_id);

-- Triggers to automatically update ratings

DELIMITER //

-- Trigger to update barber average rating
CREATE TRIGGER update_barber_rating 
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE barbers 
    SET rating_average = (
        SELECT AVG(rating) 
        FROM reviews 
        WHERE barber_id = NEW.barber_id
    ),
    total_reviews = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE barber_id = NEW.barber_id
    )
    WHERE barber_id = NEW.barber_id;
END//

-- Trigger to update barbershop average rating
CREATE TRIGGER update_barbershop_rating 
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE barbershops 
    SET rating_average = (
        SELECT AVG(rating) 
        FROM reviews 
        WHERE barbershop_id = NEW.barbershop_id
    ),
    total_reviews = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE barbershop_id = NEW.barbershop_id
    )
    WHERE barbershop_id = NEW.barbershop_id;
END//

DELIMITER ;

-- Sample data for testing

-- Insert sample barbershop
INSERT INTO barbershops (name, email, phone, password_hash, address, responsible_person, id_document, owner_phone) 
VALUES ('Classic Barbershop', 'info@classicbarbershop.com', '+573001234567', 'hash_example', 'Street 45 #23-15, Barranquilla', 'Juan Pérez', '12345678', '+573001234567');

-- Insert sample barber
INSERT INTO barbers (barbershop_id, name, description, specialties, qualification) 
VALUES (1, 'Carlos Mendoza', 'Barber with 10 years of experience', 'Classic cuts, beard styling', 'Barbering Technician');

-- Insert barber schedule
INSERT INTO barber_schedules (barber_id, day_of_week, start_time, end_time) 
VALUES (1, 'Monday', '07:00:00', '22:00:00');

-- Insert initial availability
INSERT INTO barber_availability (barber_id, status) 
VALUES (1, 'available');

-- Insert sample service
INSERT INTO services (barbershop_id, name, description, price, duration_minutes, category) 
VALUES (1, 'Classic Haircut', 'Traditional haircut service', 25000.00, 45, 'haircut');