-- 1) Crea la base (opcional si ya la tienes)
CREATE DATABASE IF NOT EXISTS myapp;
USE myapp;

-- 2) Tabla de usuarios (unifica local y Google)
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NULL,          -- bcrypt u otro hash; NULL si solo usa Google
  provider ENUM('local','google') NOT NULL DEFAULT 'local',
  google_id VARCHAR(64) NULL,               -- sub/ID que devuelve Google
  name VARCHAR(255) NULL,
  avatar_url VARCHAR(512) NULL,
  email_verified TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_email (email),
  UNIQUE KEY uk_users_google_id (google_id),
  -- Al menos una credencial presente (MySQL 8.0.16+ aplica CHECK; si tu versión lo ignora, no pasa nada)
  CONSTRAINT chk_at_least_one_credential CHECK (
    password_hash IS NOT NULL OR google_id IS NOT NULL
  )
) ENGINE=InnoDB;
