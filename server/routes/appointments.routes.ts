import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { sanitizeBody } from '../middleware/sanitize.js'
import { validate } from '../middleware/validate.js'
import {
  cancelUserAppointment,
  createAppointment,
  listAvailableTimes,
  listServices,
  listUserAppointments,
} from '../services/appointment.service.js'
import { listClientOffers } from '../services/admin.service.js'
import type { AuthenticatedRequest } from '../types/auth.js'
import { createAppointmentSchema } from '../validators/appointment.validator.js'

export const appointmentRouter = Router()

appointmentRouter.get('/services', async (_req, res) => {
  const services = await listServices()
  res.json(services)
})

appointmentRouter.get('/offers', async (_req, res) => {
  const offers = await listClientOffers()
  res.json(offers)
})

appointmentRouter.get('/slots', async (req, res) => {
  const date = req.query.date as string | undefined
  const serviceId = req.query.serviceId ? Number(req.query.serviceId) : undefined

  if (!date) {
    return res.status(400).json({ message: 'Data obrigatoria' })
  }

  const slots = await listAvailableTimes(date, serviceId)
  return res.json({ slots })
})

appointmentRouter.post('/', requireAuth, sanitizeBody, validate(createAppointmentSchema), async (req, res) => {
  const userId = Number((req as AuthenticatedRequest).user?.sub)
  const { serviceId, date, time, notes } = req.body

  try {
    const appointment = await createAppointment(userId, serviceId, date, time, notes)
    return res.status(201).json({ id: appointment.id, message: 'Agendamento criado com sucesso' })
  } catch (error) {
    if (error instanceof Error && error.message === 'TIME_SLOT_OCCUPIED') {
      return res.status(409).json({ message: 'Horario indisponivel' })
    }

    if (error instanceof Error && error.message === 'SERVICE_NOT_FOUND') {
      return res.status(404).json({ message: 'Servico nao encontrado' })
    }

    return res.status(500).json({ message: 'Falha ao criar agendamento' })
  }
})

appointmentRouter.get('/me', requireAuth, async (req, res) => {
  const userId = Number((req as AuthenticatedRequest).user?.sub)
  const appointments = await listUserAppointments(userId)
  return res.json(appointments)
})

appointmentRouter.patch('/:id/cancel', requireAuth, async (req, res) => {
  const userId = Number((req as AuthenticatedRequest).user?.sub)
  const appointmentId = Number(req.params.id)

  const canceled = await cancelUserAppointment(appointmentId, userId)

  if (!canceled) {
    return res.status(404).json({ message: 'Agendamento nao encontrado ou ja cancelado' })
  }

  return res.json({ message: 'Agendamento cancelado com sucesso' })
})

