import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import type { AuthTokenPayload } from '../types/auth.js'

export const signToken = (payload: AuthTokenPayload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] })

export const verifyToken = (token: string): AuthTokenPayload =>
  jwt.verify(token, env.jwtSecret) as AuthTokenPayload

