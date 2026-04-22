import { db } from '../config/db.js'
import type { UserRole } from '../types/auth.js'

export const getDashboardSummary = async () => {
  const [rows] = await db.query(
    `
      SELECT
        (SELECT COUNT(*) FROM app_users) AS totalUsers,
        (SELECT COUNT(*) FROM app_services WHERE is_active = 1) AS totalServices,
        (SELECT COUNT(*) FROM app_appointments) AS totalAppointments
    `,
  )

  return (rows as Array<{ totalUsers: number; totalServices: number; totalAppointments: number }>)[0]
}

export const listAdminServices = async () => {
  const [rows] = await db.query(
    `
      SELECT id, name, description, duration_minutes AS durationMinutes, price, is_active AS isActive
        FROM app_services
       ORDER BY is_active DESC, name ASC
    `,
  )

  return rows as Array<{
    id: number
    name: string
    description: string
    durationMinutes: number
    price: number
    isActive: number
  }>
}

export const createAdminService = async (payload: {
  name: string
  description: string
  durationMinutes: number
  price: number
}) => {
  const [result] = await db.query(
    `
      INSERT INTO app_services (name, description, duration_minutes, price, is_active)
      VALUES (?, ?, ?, ?, 1)
    `,
    [payload.name, payload.description, payload.durationMinutes, payload.price],
  )

  return (result as { insertId: number }).insertId
}

export const updateAdminService = async (
  id: number,
  payload: { name: string; description: string; durationMinutes: number; price: number },
) => {
  const [result] = await db.query(
    `
      UPDATE app_services
         SET name = ?, description = ?, duration_minutes = ?, price = ?, is_active = 1
       WHERE id = ?
    `,
    [payload.name, payload.description, payload.durationMinutes, payload.price, id],
  )

  return (result as { affectedRows: number }).affectedRows > 0
}

export const deactivateAdminService = async (id: number) => {
  const [result] = await db.query('UPDATE app_services SET is_active = 0 WHERE id = ?', [id])
  return (result as { affectedRows: number }).affectedRows > 0
}

export const listAdminUsers = async () => {
  const [rows] = await db.query(
    `
      SELECT id, name, email, role
        FROM app_users
       ORDER BY created_at DESC, id DESC
    `,
  )

  return rows as Array<{
    id: number
    name: string
    email: string
    role: UserRole
  }>
}

export const updateAdminUserRole = async (id: number, role: UserRole) => {
  const [result] = await db.query('UPDATE app_users SET role = ? WHERE id = ?', [role, id])
  return (result as { affectedRows: number }).affectedRows > 0
}

export const getAdminUserById = async (id: number) => {
  const [rows] = await db.query('SELECT id, role FROM app_users WHERE id = ? LIMIT 1', [id])
  return (rows as Array<{ id: number; role: UserRole }>)[0] ?? null
}

export const deleteAdminUser = async (id: number) => {
  await db.query('DELETE FROM app_appointments WHERE user_id = ?', [id])
  await db.query('DELETE FROM app_password_resets WHERE user_id = ?', [id])
  const [result] = await db.query('DELETE FROM app_users WHERE id = ?', [id])

  if ((result as { affectedRows: number }).affectedRows === 0) {
    return { deleted: false as const, reason: 'not_found' as const }
  }

  return { deleted: true as const }
}

export const listAdminOffers = async () => {
  const [rows] = await db.query(
    `
      SELECT
        o.id,
        o.service_name AS serviceName,
        o.offer_price AS offerPrice,
        o.is_active AS isActive,
        s.id AS serviceId,
        s.description AS description
      FROM app_offers o
      LEFT JOIN app_services s ON s.name = o.service_name
      ORDER BY o.is_active DESC, o.created_at DESC, o.id DESC
    `,
  )

  return rows as Array<{
    id: number
    serviceName: string
    offerPrice: number
    isActive: number
    serviceId: number | null
    description: string | null
  }>
}

export const listClientOffers = async () => {
  const [rows] = await db.query(
    `
      SELECT
        o.id,
        o.service_name AS serviceName,
        o.offer_price AS offerPrice,
        s.id AS serviceId,
        s.description AS description
      FROM app_offers o
      LEFT JOIN app_services s ON s.name = o.service_name
      WHERE o.is_active = 1
      ORDER BY o.created_at DESC, o.id DESC
    `,
  )

  return rows as Array<{
    id: number
    serviceName: string
    offerPrice: number
    serviceId: number | null
    description: string | null
  }>
}

export const createAdminOffer = async (payload: { serviceName: string; offerPrice: number }) => {
  const [result] = await db.query(
    `
      INSERT INTO app_offers (service_name, offer_price, is_active)
      VALUES (?, ?, 1)
    `,
    [payload.serviceName, payload.offerPrice],
  )

  return (result as { insertId: number }).insertId
}

export const deactivateAdminOffer = async (id: number) => {
  const [result] = await db.query('UPDATE app_offers SET is_active = 0 WHERE id = ?', [id])
  return (result as { affectedRows: number }).affectedRows > 0
}
