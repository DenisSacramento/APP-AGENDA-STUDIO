import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env'
import { errorHandler } from './middleware/error-handler'
import { authRouter } from './routes/auth.routes'
import { appointmentRouter } from './routes/appointments.routes'
import { adminRouter } from './routes/admin.routes'

export const app = express()

app.use(
  cors({
    origin: env.frontendUrl,
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
