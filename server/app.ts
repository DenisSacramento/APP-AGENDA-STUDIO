import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import { initDatabase } from './config/db.js'
import { errorHandler } from './middleware/error-handler.js'
import { authRouter } from './routes/auth.routes.js'
import { appointmentRouter } from './routes/appointments.routes.js'
import { adminRouter } from './routes/admin.routes.js'

export const app = express()
// Trust proxy headers (X-Forwarded-For) when running behind Vercel/Netlify proxies
// This ensures `req.ip` and rate-limiting key generation use the forwarded IP.
app.set('trust proxy', true)
const allowedOrigins = new Set(env.frontendUrls)
const isAllowedOrigin = (origin?: string) => {
  if (!origin) {
    return true
  }

  if (allowedOrigins.has(origin)) {
    return true
  }

  try {
    const { hostname, protocol } = new URL(origin)
    return protocol === 'https:' && hostname.endsWith('.vercel.app')
  } catch {
    return false
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('Origin not allowed by CORS'))
    },
    credentials: true,
  }),
)
app.use(helmet())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'studio-karine-reverte-api' })
})

app.use('/api/auth', authRouter)
app.use('/api/appointments', appointmentRouter)
app.use('/api/admin', adminRouter)

app.use(errorHandler)

// In some deployment environments (serverless) the DB initialization
// may not be executed. Ensure database schema and admin user exist.
initDatabase().catch((err) => {
  console.error('Database init failed:', err)
})

