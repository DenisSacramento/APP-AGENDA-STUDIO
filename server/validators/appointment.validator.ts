import { z } from 'zod'

export const createAppointmentSchema = z.object({
  serviceId: z.number().int().positive(),
  date: z.iso.date(),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  notes: z.string().max(500).optional(),
})

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(['pendente', 'confirmado', 'cancelado']),
})
