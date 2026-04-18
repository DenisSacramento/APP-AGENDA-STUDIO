import dotenv from 'dotenv'

dotenv.config()

const requireEnv = (key: string, fallback?: string) => {
  const value = process.env[key] ?? fallback
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 8787),
  jwtSecret: requireEnv('JWT_SECRET', 'dev-only-secret-change-me'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  frontendUrl:
    process.env.FRONTEND_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173'),
  frontendUrls: (
    process.env.FRONTEND_URLS ??
    [
      process.env.FRONTEND_URL,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
      'http://localhost:5173',
    ]
      .filter(Boolean)
      .join(',')
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  adminEmail: requireEnv('ADMIN_EMAIL', 'admin@studiokarinereverte.com'),
  adminPassword: requireEnv('ADMIN_PASSWORD', 'Admin@123456'),
  tidbHost: requireEnv('TIDB_HOST', 'localhost'),
  tidbPort: Number(process.env.TIDB_PORT ?? 4000),
  tidbUser: requireEnv('TIDB_USER', 'root'),
  tidbPassword: process.env.TIDB_PASSWORD ?? '',
  tidbDatabase: requireEnv('TIDB_DATABASE', 'studio_karine_reverte'),
  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT ?? 587),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  smtpFrom: process.env.SMTP_FROM ?? 'noreply@studiokarinereverte.com',
}
