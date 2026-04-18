import type { NextFunction, Request, Response } from 'express'
import { sanitizeInput } from '../utils/sanitize.js'

export const sanitizeBody = (req: Request, _res: Response, next: NextFunction) => {
  req.body = sanitizeInput(req.body) as Record<string, unknown>
  next()
}

