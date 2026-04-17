export type AppointmentStatus = 'pendente' | 'confirmado' | 'cancelado'
export type UserRole = 'client' | 'admin'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Service {
  id: number
  name: string
  description: string
  durationMinutes: number
  price: number
}

export interface Appointment {
  id: number
  date: string
  time: string
  status: AppointmentStatus
  notes?: string | null
  serviceName: string
  durationMinutes: number
}

export interface AdminAppointment {
  id: number
  date: string
  time: string
  status: AppointmentStatus
  clientName: string
  clientEmail: string
  serviceName: string
}
