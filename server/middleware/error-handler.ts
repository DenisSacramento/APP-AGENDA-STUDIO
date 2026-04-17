import type { NextFunction, Request, Response } from 'express'

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  void _next
  console.error(err)
  res.status(500).json({ message: 'Erro interno do servidor' })
}
