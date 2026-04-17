import { db } from '../config/db'

export const listServices = async () => {
  const [rows] = await db.query(
    'SELECT id, name, description, duration_minutes AS durationMinutes, price FROM services WHERE is_active = 1 ORDER BY name',
  )
  return rows as Array<{
    id: number
    name: string
    description: string
    durationMinutes: number
    price: number
  }>
}

export const listAvailableTimes = async (date: string) => {
  const workingHours = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ]

  const [rows] = await db.query(
    "SELECT time_slot AS time FROM appointments WHERE appointment_date = ? AND status IN ('pendente','confirmado')",
    [date],
  )

  const occupied = new Set((rows as Array<{ time: string }>).map((row) => row.time))
  return workingHours.filter((time) => !occupied.has(time))
}

export const createAppointment = async (
  userId: number,
  serviceId: number,
  date: string,
  time: string,
  notes?: string,
) => {
  const conn = await db.getConnection()
  try {
    await conn.beginTransaction()

    const [serviceRows] = await conn.query('SELECT id FROM services WHERE id = ? AND is_active = 1', [
      serviceId,
    ])
    if ((serviceRows as Array<{ id: number }>).length === 0) {
      throw new Error('SERVICE_NOT_FOUND')
    }

    const [occupiedRows] = await conn.query(
      "SELECT id FROM appointments WHERE appointment_date = ? AND time_slot = ? AND status IN ('pendente','confirmado') FOR UPDATE",
      [date, time],
    )

    if ((occupiedRows as Array<{ id: number }>).length > 0) {
      throw new Error('TIME_SLOT_OCCUPIED')
    }

    const [result] = await conn.query(
      'INSERT INTO appointments (user_id, service_id, appointment_date, time_slot, notes, status) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, serviceId, date, time, notes ?? null, 'pendente'],
    )

    await conn.commit()
    return { id: (result as { insertId: number }).insertId }
  } catch (error) {
    await conn.rollback()
    throw error
  } finally {
    conn.release()
  }
}

export const listUserAppointments = async (userId: number) => {
  const [rows] = await db.query(
    `SELECT a.id, a.appointment_date AS date, a.time_slot AS time, a.status, a.notes,
            s.name AS serviceName, s.duration_minutes AS durationMinutes
       FROM appointments a
       INNER JOIN services s ON s.id = a.service_id
      WHERE a.user_id = ?
      ORDER BY a.appointment_date DESC, a.time_slot DESC`,
    [userId],
  )

  return rows
}

export const cancelUserAppointment = async (appointmentId: number, userId: number) => {
  const [result] = await db.query(
    "UPDATE appointments SET status = 'cancelado' WHERE id = ? AND user_id = ? AND status <> 'cancelado'",
    [appointmentId, userId],
  )

  return (result as { affectedRows: number }).affectedRows > 0
}

export const listAdminAppointments = async (date?: string, search?: string) => {
  let sql = `SELECT a.id, a.appointment_date AS date, a.time_slot AS time, a.status,
                    s.name AS serviceName, u.name AS clientName, u.email AS clientEmail
               FROM appointments a
               INNER JOIN users u ON u.id = a.user_id
               INNER JOIN services s ON s.id = a.service_id
              WHERE 1=1`
  const params: Array<string> = []

  if (date) {
    sql += ' AND a.appointment_date = ?'
    params.push(date)
  }

  if (search) {
    sql += ' AND (u.name LIKE ? OR u.email LIKE ?)'
    params.push(`%${search}%`, `%${search}%`)
  }

  sql += ' ORDER BY a.appointment_date DESC, a.time_slot DESC'

  const [rows] = await db.query(sql, params)
  return rows
}

export const updateAppointmentStatus = async (
  appointmentId: number,
  status: 'pendente' | 'confirmado' | 'cancelado',
) => {
  const [result] = await db.query('UPDATE appointments SET status = ? WHERE id = ?', [
    status,
    appointmentId,
  ])

  return (result as { affectedRows: number }).affectedRows > 0
}
