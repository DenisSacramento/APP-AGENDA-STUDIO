import type { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../utils/jwt'

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token nao informado' })
  }

  try {
    const token = authHeader.slice(7)
    req.user = verifyToken(token)
    return next()
  } catch {
    return res.status(401).json({ message: 'Token invalido ou expirado' })
  }
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso restrito ao administrador' })
  }

  return next()
}
