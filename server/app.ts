import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import { errorHandler } from './middleware/error-handler.js'
import { authRouter } from './routes/auth.routes.js'
import { appointmentRouter } from './routes/appointments.routes.js'
import { adminRouter } from './routes/admin.routes.js'

export const app = express()
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

