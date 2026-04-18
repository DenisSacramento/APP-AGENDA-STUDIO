import mysql from 'mysql2/promise'
import { env } from './env.js'

export const db = mysql.createPool({
  host: env.tidbHost,
  port: env.tidbPort,
  user: env.tidbUser,
  password: env.tidbPassword,
  database: env.tidbDatabase,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: false,
  },
})

export const initDatabase = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS app_users (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS app_services (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(120) NOT NULL,
      description TEXT NOT NULL,
      duration_minutes INT NOT NULL,
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS app_appointments (
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
      CONSTRAINT fk_app_appointments_user FOREIGN KEY (user_id) REFERENCES app_users(id),
      CONSTRAINT fk_app_appointments_service FOREIGN KEY (service_id) REFERENCES app_services(id)
    )
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS app_password_resets (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      user_id BIGINT NOT NULL,
      token VARCHAR(128) NOT NULL UNIQUE,
      expires_at DATETIME NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_app_password_resets_user FOREIGN KEY (user_id) REFERENCES app_users(id)
    )
  `)

  const [serviceCountRows] = await db.query('SELECT COUNT(*) AS total FROM app_services')
  const totalServices = Number((serviceCountRows as Array<{ total: number }>)[0]?.total ?? 0)

  if (totalServices === 0) {
    await db.query(
      `
        INSERT INTO app_services (name, description, duration_minutes, price)
        VALUES
          ('Corte Feminino', 'Corte moderno com finalizacao personalizada.', 60, 120.00),
          ('Escova Modelada', 'Escova com acabamento e volume sob medida.', 50, 90.00),
          ('Manicure Premium', 'Cuidado completo com esmaltacao de alta durabilidade.', 45, 65.00),
          ('Coloracao', 'Coloracao completa com avaliacao profissional.', 120, 250.00)
      `,
    )
  }
}

