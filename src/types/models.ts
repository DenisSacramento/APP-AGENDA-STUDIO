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

export interface AdminDashboardSummary {
  totalUsers: number
  totalServices: number
  totalAppointments: number
}

export interface AdminService {
  id: number
  name: string
  description: string
  durationMinutes: number
  price: number
  isActive: number
}

export interface AdminServicePayload {
  name: string
  description: string
  durationMinutes: number
  price: number
}

export interface AdminUser {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface Offer {
  id: number
  serviceName: string
  offerPrice: number
  description?: string | null
}

export interface AdminOffer extends Offer {
  isActive: number
}

export interface AdminOfferPayload {
  serviceName: string
  offerPrice: number
}
