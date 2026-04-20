import mysql from 'mysql2/promise'
import { env } from './env.js'

const OFFICIAL_SERVICES = [
  {
    name: 'Corte simples',
    description: 'Corte simples com acabamento.',
    durationMinutes: 45,
    price: 35,
  },
  {
    name: 'Corte long bob/Chanel',
    description: 'Corte long bob ou chanel com finalização.',
    durationMinutes: 60,
    price: 40,
  },
  {
    name: 'Progressiva P e M',
    description: 'Progressiva para cabelos de comprimento pequeno e médio.',
    durationMinutes: 180,
    price: 150,
  },
  {
    name: 'Progressiva G',
    description: 'Progressiva para cabelos longos e volumosos.',
    durationMinutes: 210,
    price: 200,
  },
  {
    name: 'Coloração + hidratação',
    description: 'Coloração com hidratação para brilho e maciez.',
    durationMinutes: 120,
    price: 65,
  },
  {
    name: 'Escova simples Mega Hair',
    description: 'Escova simples para Mega Hair.',
    durationMinutes: 60,
    price: 70,
  },
  {
    name: 'Escova Mega Hair + hidratação',
    description: 'Escova para Mega Hair com hidratação.',
    durationMinutes: 80,
    price: 80,
  },
  {
    name: 'Hidroreconstrução',
    description: 'Tratamento de hidroreconstrução.',
    durationMinutes: 75,
    price: 70,
  },
  {
    name: 'Hidronutrição + finalização',
    description: 'Hidronutrição com finalização completa.',
    durationMinutes: 75,
    price: 70,
  },
  {
    name: 'Escova + hidratação',
    description: 'Escova com hidratação para alinhamento e brilho.',
    durationMinutes: 60,
    price: 50,
  },
  {
    name: 'Escova simples',
    description: 'Escova simples com acabamento.',
    durationMinutes: 45,
    price: 40,
  },
  {
    name: 'Botox a partir de',
    description: 'Tratamento botox capilar. Valor inicial.',
    durationMinutes: 120,
    price: 90,
  },
  {
    name: 'Reconstrução',
    description: 'Reconstrução capilar intensiva.',
    durationMinutes: 90,
    price: 80,
  },
  {
    name: 'Selagem a partir de',
    description: 'Selagem capilar. Valor inicial.',
    durationMinutes: 120,
    price: 100,
  },
  {
    name: 'Cristalização',
    description: 'Cristalização para brilho e alinhamento.',
    durationMinutes: 90,
    price: 75,
  },
  {
    name: 'Cauterização',
    description: 'Cauterização capilar para reposição de massa.',
    durationMinutes: 90,
    price: 80,
  },
  {
    name: 'Cronograma capilar (4 sessões)',
    description: 'Pacote com 4 sessões de cronograma capilar.',
    durationMinutes: 240,
    price: 200,
  },
] as const

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

  for (const service of OFFICIAL_SERVICES) {
    const [updateResult] = await db.query(
      `
        UPDATE app_services
           SET description = ?, duration_minutes = ?, price = ?, is_active = 1
         WHERE name = ?
      `,
      [service.description, service.durationMinutes, service.price, service.name],
    )

    if ((updateResult as { affectedRows: number }).affectedRows === 0) {
      await db.query(
        `
          INSERT INTO app_services (name, description, duration_minutes, price, is_active)
          VALUES (?, ?, ?, ?, 1)
        `,
        [service.name, service.description, service.durationMinutes, service.price],
      )
    }
  }

  const officialNamesPlaceholders = OFFICIAL_SERVICES.map(() => '?').join(', ')
  await db.query(
    `
      UPDATE app_services
         SET is_active = 0
       WHERE name NOT IN (${officialNamesPlaceholders})
    `,
    OFFICIAL_SERVICES.map((service) => service.name),
  )
}

