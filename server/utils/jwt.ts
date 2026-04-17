import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import type { AuthTokenPayload } from '../types/auth'

export const signToken = (payload: AuthTokenPayload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn })

export const verifyToken = (token: string): AuthTokenPayload =>
  jwt.verify(token, env.jwtSecret) as AuthTokenPayload
