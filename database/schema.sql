CREATE DATABASE IF NOT EXISTS studio_karine_reverte;
USE studio_karine_reverte;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  duration_minutes INT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  service_id BIGINT NOT NULL,
  appointment_date DATE NOT NULL,
  time_slot CHAR(5) NOT NULL,
  notes VARCHAR(500),
  status ENUM('pendente', 'confirmado', 'cancelado') NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date_time (appointment_date, time_slot),
  INDEX idx_user (user_id),
  CONSTRAINT fk_appointments_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_appointments_service FOREIGN KEY (service_id) REFERENCES services(id)
);

CREATE TABLE IF NOT EXISTS password_resets (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  token VARCHAR(128) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_password_resets_user FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO services (name, description, duration_minutes, price)
VALUES
  ('Corte simples', 'Corte simples com acabamento.', 45, 35.00),
  ('Corte long bob/Chanel', 'Corte long bob ou chanel com finalizacao.', 60, 40.00),
  ('Progressiva P e M', 'Progressiva para cabelos de comprimento pequeno e medio.', 180, 150.00),
  ('Progressiva G', 'Progressiva para cabelos longos e volumosos.', 210, 200.00),
  ('Coloracao + hidratacao', 'Coloracao com hidratacao para brilho e maciez.', 120, 65.00),
  ('Escova simples Mega Hair', 'Escova simples para Mega Hair.', 60, 70.00),
  ('Escova Mega Hair + hidratacao', 'Escova para Mega Hair com hidratacao.', 80, 80.00),
  ('Hidroreconstrucao', 'Tratamento de hidroreconstrucao.', 75, 70.00),
  ('Hidronutricao + finalizacao', 'Hidronutricao com finalizacao completa.', 75, 70.00),
  ('Escova + hidratacao', 'Escova com hidratacao para alinhamento e brilho.', 60, 50.00),
  ('Escova simples', 'Escova simples com acabamento.', 45, 40.00),
  ('Botox a partir de', 'Tratamento botox capilar. Valor inicial.', 120, 90.00),
  ('Reconstrucao', 'Reconstrucao capilar intensiva.', 90, 80.00),
  ('Selagem a partir de', 'Selagem capilar. Valor inicial.', 120, 100.00),
  ('Cristalizacao', 'Cristalizacao para brilho e alinhamento.', 90, 75.00),
  ('Cauterizacao', 'Cauterizacao capilar para reposicao de massa.', 90, 80.00),
  ('Cronograma capilar (4 sessoes)', 'Pacote com 4 sessoes de cronograma capilar.', 240, 200.00)
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  duration_minutes = VALUES(duration_minutes),
  price = VALUES(price);
