import crypto from 'node:crypto'
import { db } from '../config/db.js'
import { env } from '../config/env.js'
import { comparePassword, hashPassword } from '../utils/password.js'
import { sendPasswordResetEmail } from '../utils/email.js'

interface DbUser {
  id: number
  name: string
  email: string
  password_hash: string
  role: 'client' | 'admin'
}

export const registerUser = async (name: string, email: string, password: string) => {
  const [existing] = await db.query('SELECT id FROM app_users WHERE email = ?', [email])
  if ((existing as Array<{ id: number }>).length > 0) {
    throw new Error('EMAIL_ALREADY_EXISTS')
  }

  const passwordHash = await hashPassword(password)
  const [result] = await db.query(
    'INSERT INTO app_users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, 'client'],
  )

  const userId = (result as { insertId: number }).insertId
  return { id: userId, name, email, role: 'client' as const }
}

export const loginUser = async (email: string, password: string) => {
  const [rows] = await db.query('SELECT id, name, email, password_hash, role FROM app_users WHERE email = ?', [email])
  const user = (rows as DbUser[])[0]

  if (!user || !user.password_hash) {
    throw new Error('INVALID_CREDENTIALS')
  }

  let isPasswordValid = false
  try {
    isPasswordValid = await comparePassword(password, user.password_hash)
  } catch {
    // Se comparePassword lançar por dados inválidos, tratamos como credenciais inválidas
    throw new Error('INVALID_CREDENTIALS')
  }

  if (!isPasswordValid) {
    throw new Error('INVALID_CREDENTIALS')
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

export const sendResetPassword = async (email: string) => {
  const [rows] = await db.query('SELECT id, email FROM app_users WHERE email = ?', [email])
  const user = (rows as Array<{ id: number; email: string }>)[0]

  if (!user) {
    return
  }

  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30)

  await db.query('INSERT INTO app_password_resets (user_id, token, expires_at) VALUES (?, ?, ?)', [
    user.id,
    token,
    expiresAt,
  ])

  const resetLink = `${env.frontendUrl}/reset-password?token=${token}`
  await sendPasswordResetEmail(user.email, resetLink)
}

