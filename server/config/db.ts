import mysql from 'mysql2/promise'
import { env } from './env'

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
