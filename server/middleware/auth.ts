import type { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../utils/jwt.js'
import type { AuthenticatedRequest } from '../types/auth.js'

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const request = req as AuthenticatedRequest
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token nao informado' })
  }

  try {
    const token = authHeader.slice(7)
    request.user = verifyToken(token)
    return next()
  } catch {
    return res.status(401).json({ message: 'Token invalido ou expirado' })
  }
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const request = req as AuthenticatedRequest

  if (!request.user || request.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso restrito ao administrador' })
  }

  return next()
}

