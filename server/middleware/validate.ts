import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'

export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
  const parsed = schema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      message: 'Dados invalidos',
      errors: parsed.error.issues.map((issue) => issue.message),
    })
  }

  req.body = parsed.data
  return next()
}
