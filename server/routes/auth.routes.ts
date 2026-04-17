import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { sanitizeBody } from '../middleware/sanitize'
import { validate } from '../middleware/validate'
import { forgotPasswordSchema, loginSchema, registerSchema } from '../validators/auth.validator'
import { loginUser, registerUser, sendResetPassword } from '../services/auth.service'
import { signToken } from '../utils/jwt'

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
})

export const authRouter = Router()

authRouter.use(authLimiter)

authRouter.post('/register', sanitizeBody, validate(registerSchema), async (req, res) => {
  try {
    const { name, email, password } = req.body
    const user = await registerUser(name, email, password)
    const token = signToken({
      sub: String(user.id),
      email: user.email,
      role: 'client',
      name: user.name,
    })

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'client',
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'EMAIL_ALREADY_EXISTS') {
      return res.status(409).json({ message: 'Email ja cadastrado' })
    }

    return res.status(500).json({ message: 'Falha ao criar conta' })
  }
})

authRouter.post('/login', sanitizeBody, validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await loginUser(email, password)

    const token = signToken({
      sub: String(user.id),
      email: user.email,
      role: 'client',
      name: user.name,
    })

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'client',
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ message: 'Credenciais invalidas' })
    }

    return res.status(500).json({ message: 'Falha no login' })
  }
})

authRouter.post('/forgot-password', sanitizeBody, validate(forgotPasswordSchema), async (req, res) => {
  const { email } = req.body
  await sendResetPassword(email)

  return res.json({
    message: 'Se o email existir, enviaremos as instrucoes de recuperacao.',
  })
})
