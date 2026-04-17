import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no minimo 2 caracteres').max(120),
  email: z.email('Email invalido').max(255),
  password: z
    .string()
    .min(8, 'Senha deve ter no minimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter letra maiuscula')
    .regex(/[a-z]/, 'Senha deve conter letra minuscula')
    .regex(/[0-9]/, 'Senha deve conter numero'),
})

export const loginSchema = z.object({
  email: z.email('Email invalido'),
  password: z.string().min(1, 'Senha obrigatoria'),
})

export const forgotPasswordSchema = z.object({
  email: z.email('Email invalido'),
})
