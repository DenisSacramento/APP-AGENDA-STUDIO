import type { Request } from 'express'

export type UserRole = 'client' | 'admin'

export interface AuthTokenPayload {
  sub: string
  email: string
  role: UserRole
  name: string
}

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload
}
