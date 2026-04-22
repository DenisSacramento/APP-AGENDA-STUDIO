import { db } from '../config/db.js'

export const listServices = async () => {
  const [rows] = await db.query(
    `SELECT id, name, description, duration_minutes AS durationMinutes, price
       FROM app_services
      WHERE is_active = 1
      ORDER BY name ASC`,
  )
  return rows as Array<{
    id: number
    name: string
    description: string
    durationMinutes: number
    price: number
  }>
}

export const listAvailableTimes = async (date: string, serviceId?: number) => {
  // slots every 30 minutes from 09:00 to 18:00 (last start 17:30)
  const slotIntervalMinutes = 30
  const startMinutes = 9 * 60 // 09:00
  const endMinutes = 18 * 60 // 18:00

  // determine requested service duration (default to 30 if not provided)
  let requestedDuration = 30
  if (serviceId) {
    const [srows] = await db.query('SELECT duration_minutes AS durationMinutes FROM app_services WHERE id = ? AND is_active = 1', [serviceId])
    if ((srows as Array<{ durationMinutes: number }>).length > 0) {
      requestedDuration = (srows as Array<{ durationMinutes: number }>)[0].durationMinutes
    }
  }

  // fetch existing appointments for the date with their service durations
  const [rows] = await db.query(
    `SELECT a.time_slot AS time, s.duration_minutes AS durationMinutes
       FROM app_appointments a
       INNER JOIN app_services s ON s.id = a.service_id
      WHERE a.appointment_date = ? AND a.status IN ('pendente','confirmado')`,
    [date],
  )

  const existing = rows as Array<{ time: string; durationMinutes: number }>

  const timeToMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }

  const slots: string[] = []
  for (let m = startMinutes; m + slotIntervalMinutes <= endMinutes; m += slotIntervalMinutes) {
    const hh = String(Math.floor(m / 60)).padStart(2, '0')
    const mm = String(m % 60).padStart(2, '0')
    slots.push(`${hh}:${mm}`)
  }

  const available = slots.filter((slot) => {
    const reqStart = timeToMinutes(slot)
    const reqEnd = reqStart + requestedDuration

    for (const ap of existing) {
      const exStart = timeToMinutes(ap.time)
      const exEnd = exStart + ap.durationMinutes

      // overlap if exStart < reqEnd AND exEnd > reqStart
      if (exStart < reqEnd && exEnd > reqStart) return false
    }

    return true
  })

  return available
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

    const [serviceRows] = await conn.query(
      `SELECT id
         FROM app_services
        WHERE id = ?
          AND is_active = 1`,
      [serviceId],
    )
    if ((serviceRows as Array<{ id: number }>).length === 0) {
      throw new Error('SERVICE_NOT_FOUND')
    }

    // Verifica sobreposição considerando duração do servico
    const [[serviceInfo]] = (await conn.query('SELECT duration_minutes AS durationMinutes FROM app_services WHERE id = ? LIMIT 1', [serviceId])) as unknown as [[{ durationMinutes: number }]]
    const reqDuration = serviceInfo?.durationMinutes ?? 30

    const [occupiedRows] = await conn.query(
      `SELECT a.id
         FROM app_appointments a
         INNER JOIN app_services s ON s.id = a.service_id
        WHERE a.appointment_date = ?
          AND a.status IN ('pendente','confirmado')
          AND (STR_TO_DATE(a.time_slot, '%H:%i') < ADDTIME(STR_TO_DATE(?, '%H:%i'), SEC_TO_TIME(?*60))
               AND ADDTIME(STR_TO_DATE(a.time_slot, '%H:%i'), SEC_TO_TIME(s.duration_minutes*60)) > STR_TO_DATE(?, '%H:%i'))
        FOR UPDATE`,
      [date, time, reqDuration, time],
    )

    if ((occupiedRows as Array<{ id: number }>).length > 0) {
      throw new Error('TIME_SLOT_OCCUPIED')
    }

    const [result] = await conn.query(
      'INSERT INTO app_appointments (user_id, service_id, appointment_date, time_slot, notes, status) VALUES (?, ?, ?, ?, ?, ?)',
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
       FROM app_appointments a
       INNER JOIN app_services s ON s.id = a.service_id
      WHERE a.user_id = ?
      ORDER BY a.appointment_date DESC, a.time_slot DESC`,
    [userId],
  )

  return rows
}

export const cancelUserAppointment = async (appointmentId: number, userId: number) => {
  const [result] = await db.query(
    "UPDATE app_appointments SET status = 'cancelado' WHERE id = ? AND user_id = ? AND status <> 'cancelado'",
    [appointmentId, userId],
  )

  return (result as { affectedRows: number }).affectedRows > 0
}

export const listAdminAppointments = async (date?: string, search?: string) => {
  let sql = `SELECT a.id, a.appointment_date AS date, a.time_slot AS time, a.status,
                    s.name AS serviceName, u.name AS clientName, u.email AS clientEmail
        FROM app_appointments a
        INNER JOIN app_users u ON u.id = a.user_id
        INNER JOIN app_services s ON s.id = a.service_id
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
  const [result] = await db.query('UPDATE app_appointments SET status = ? WHERE id = ?', [
    status,
    appointmentId,
  ])

  return (result as { affectedRows: number }).affectedRows > 0
}

export const deleteAdminAppointment = async (appointmentId: number) => {
  const [result] = await db.query('DELETE FROM app_appointments WHERE id = ?', [appointmentId])
  return (result as { affectedRows: number }).affectedRows > 0
}

