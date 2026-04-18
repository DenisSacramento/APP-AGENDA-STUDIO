import { Router } from 'express'
import { env } from '../config/env.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js'
import { sanitizeBody } from '../middleware/sanitize.js'
import { validate } from '../middleware/validate.js'
import { comparePassword } from '../utils/password.js'
import { signToken } from '../utils/jwt.js'
import { loginSchema } from '../validators/auth.validator.js'
import { updateAppointmentStatusSchema } from '../validators/appointment.validator.js'
import { listAdminAppointments, updateAppointmentStatus } from '../services/appointment.service.js'

export const adminRouter = Router()

adminRouter.post('/login', sanitizeBody, validate(loginSchema), async (req, res) => {
  const { email, password } = req.body

  if (email !== env.adminEmail) {
    return res.status(401).json({ message: 'Credenciais invalidas' })
  }

  const validPassword = await comparePassword(password, await importAdminPasswordHash())
  if (!validPassword) {
    return res.status(401).json({ message: 'Credenciais invalidas' })
  }

  const token = signToken({
    sub: '0',
    email: env.adminEmail,
    role: 'admin',
    name: 'Administrador',
  })

  return res.json({
    token,
    user: {
      id: 0,
      name: 'Administrador',
      email: env.adminEmail,
      role: 'admin',
    },
  })
})

adminRouter.get('/appointments', requireAuth, requireAdmin, async (req, res) => {
  const date = req.query.date as string | undefined
  const search = req.query.search as string | undefined

  const appointments = await listAdminAppointments(date, search)
  return res.json(appointments)
})

adminRouter.patch(
  '/appointments/:id/status',
  requireAuth,
  requireAdmin,
  sanitizeBody,
  validate(updateAppointmentStatusSchema),
  async (req, res) => {
    const appointmentId = Number(req.params.id)
    const { status } = req.body

    const updated = await updateAppointmentStatus(appointmentId, status)
    if (!updated) {
      return res.status(404).json({ message: 'Agendamento nao encontrado' })
    }

    return res.json({ message: 'Status atualizado com sucesso' })
  },
)

const importAdminPasswordHash = async () => {
  const { hashPassword } = await import('../utils/password.js')

  if (env.adminPassword.startsWith('$2')) {
    return env.adminPassword
  }

  return hashPassword(env.adminPassword)
}

