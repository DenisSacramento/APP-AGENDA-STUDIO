import { z } from 'zod'

export const upsertServiceSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no minimo 2 caracteres').max(120),
  description: z.string().min(5, 'Descricao deve ter no minimo 5 caracteres').max(1000),
  durationMinutes: z.number().int().positive('Duracao deve ser maior que zero'),
  price: z.number().positive('Preco deve ser maior que zero'),
})

export const updateUserRoleSchema = z.object({
  role: z.enum(['client', 'admin']),
})

export const upsertOfferSchema = z.object({
  serviceName: z.string().min(2, 'Nome do serviço deve ter no mínimo 2 caracteres').max(120),
  offerPrice: z.number().positive('Preço da oferta deve ser maior que zero'),
})
