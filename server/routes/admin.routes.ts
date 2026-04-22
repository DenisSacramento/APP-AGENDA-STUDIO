import { Router } from 'express'
import type { Request, Response } from 'express'
import { env } from '../config/env.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js'
import { sanitizeBody } from '../middleware/sanitize.js'
import { validate } from '../middleware/validate.js'
import { comparePassword } from '../utils/password.js'
import { signToken } from '../utils/jwt.js'
import { loginSchema } from '../validators/auth.validator.js'
import { updateAppointmentStatusSchema } from '../validators/appointment.validator.js'
import { updateUserRoleSchema, upsertServiceSchema } from '../validators/admin.validator.js'
import { deleteAdminAppointment, listAdminAppointments, updateAppointmentStatus } from '../services/appointment.service.js'
import {
  createAdminService,
  deleteAdminUser,
  deactivateAdminService,
  getAdminUserById,
  getDashboardSummary,
  listAdminServices,
  listAdminUsers,
  updateAdminService,
  updateAdminUserRole,
} from '../services/admin.service.js'

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

adminRouter.get('/dashboard', requireAuth, requireAdmin, async (_req, res) => {
  const summary = await getDashboardSummary()
  return res.json(summary)
})

adminRouter.get('/services', requireAuth, requireAdmin, async (_req, res) => {
  const services = await listAdminServices()
  return res.json(services)
})

adminRouter.post('/services', requireAuth, requireAdmin, sanitizeBody, validate(upsertServiceSchema), async (req, res) => {
  const serviceId = await createAdminService(req.body)
  return res.status(201).json({ id: serviceId, message: 'Servico criado com sucesso' })
})

adminRouter.put('/services/:id', requireAuth, requireAdmin, sanitizeBody, validate(upsertServiceSchema), async (req, res) => {
  const serviceId = Number(req.params.id)
  const updated = await updateAdminService(serviceId, req.body)

  if (!updated) {
    return res.status(404).json({ message: 'Servico nao encontrado' })
  }

  return res.json({ message: 'Servico atualizado com sucesso' })
})

adminRouter.delete('/services/:id', requireAuth, requireAdmin, async (req, res) => {
  const serviceId = Number(req.params.id)
  const deleted = await deactivateAdminService(serviceId)

  if (!deleted) {
    return res.status(404).json({ message: 'Servico nao encontrado' })
  }

  return res.json({ message: 'Servico removido com sucesso' })
})

adminRouter.get('/users', requireAuth, requireAdmin, async (_req, res) => {
  const users = await listAdminUsers()
  return res.json(users)
})

adminRouter.patch(
  '/users/:id/role',
  requireAuth,
  requireAdmin,
  sanitizeBody,
  validate(updateUserRoleSchema),
  async (req, res) => {
    const userId = Number(req.params.id)
    const { role } = req.body

    const updated = await updateAdminUserRole(userId, role)
    if (!updated) {
      return res.status(404).json({ message: 'Usuario nao encontrado' })
    }

    return res.json({ message: 'Perfil de usuario atualizado com sucesso' })
  },
)

const handleDeleteUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id)

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ message: 'ID de usuario invalido' })
    }

    if (Number(req.user?.sub ?? 0) === userId) {
      return res.status(400).json({ message: 'Nao e permitido excluir o proprio usuario admin' })
    }

    const targetUser = await getAdminUserById(userId)
    if (!targetUser) {
      return res.status(404).json({ message: 'Usuario nao encontrado' })
    }

    if (targetUser.role === 'admin') {
      return res.status(400).json({ message: 'Nao e permitido excluir usuarios administradores' })
    }

    const result = await deleteAdminUser(userId)
    if (!result.deleted) {
      return res.status(404).json({ message: 'Usuario nao encontrado' })
    }

    return res.json({ message: 'Usuario excluido com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir usuario:', error)
    return res.status(500).json({ message: 'Erro ao excluir usuario' })
  }
}

adminRouter.delete('/users/:id', requireAuth, requireAdmin, handleDeleteUser)
adminRouter.post('/users/:id/delete', requireAuth, requireAdmin, handleDeleteUser)

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

const handleDeleteAppointment = async (req: Request, res: Response) => {
  const appointmentId = Number(req.params.id)
  if (!Number.isInteger(appointmentId) || appointmentId <= 0) {
    return res.status(400).json({ message: 'ID de agendamento invalido' })
  }

  const deleted = await deleteAdminAppointment(appointmentId)
  if (!deleted) {
    return res.status(404).json({ message: 'Agendamento nao encontrado' })
  }

  return res.json({ message: 'Agendamento excluido com sucesso' })
}

adminRouter.delete('/appointments/:id', requireAuth, requireAdmin, handleDeleteAppointment)
adminRouter.post('/appointments/:id/delete', requireAuth, requireAdmin, handleDeleteAppointment)

const importAdminPasswordHash = async () => {
  const { hashPassword } = await import('../utils/password.js')

  if (env.adminPassword.startsWith('$2')) {
    return env.adminPassword
  }

  return hashPassword(env.adminPassword)
}

