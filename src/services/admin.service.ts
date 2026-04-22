import type {
  AdminAppointment,
  AdminDashboardSummary,
  AdminOffer,
  AdminOfferPayload,
  AdminService,
  AdminServicePayload,
  AdminUser,
  AppointmentStatus,
  UserRole,
} from '../types/models'
import { ApiError, request } from './http'

export const adminService = {
  getDashboardSummary: (token: string) =>
    request<AdminDashboardSummary>('/admin/dashboard', { token }),

  getServices: (token: string) =>
    request<AdminService[]>('/admin/services', { token }),

  getOffers: (token: string) =>
    request<AdminOffer[]>('/admin/offers', { token }),

  createService: (token: string, payload: AdminServicePayload) =>
    request<{ id: number; message: string }>('/admin/services', { method: 'POST', body: payload, token }),

  createOffer: (token: string, payload: AdminOfferPayload) =>
    request<{ id: number; message: string }>('/admin/offers', { method: 'POST', body: payload, token }),

  updateService: (token: string, serviceId: number, payload: AdminServicePayload) =>
    request<{ message: string }>(`/admin/services/${serviceId}`, { method: 'PUT', body: payload, token }),

  deleteService: (token: string, serviceId: number) =>
    request<{ message: string }>(`/admin/services/${serviceId}`, { method: 'DELETE', token }),

  deleteOffer: (token: string, offerId: number) =>
    request<{ message: string }>(`/admin/offers/${offerId}`, { method: 'DELETE', token }),

  getAppointments: (token: string, date?: string, search?: string) => {
    const query = new URLSearchParams()
    if (date) query.set('date', date)
    if (search) query.set('search', search)
    const suffix = query.toString() ? `?${query.toString()}` : ''

    return request<AdminAppointment[]>(`/admin/appointments${suffix}`, { token })
  },

  updateAppointmentStatus: (token: string, appointmentId: number, status: AppointmentStatus) =>
    request<{ message: string }>(`/admin/appointments/${appointmentId}/status`, {
      method: 'PATCH',
      body: { status },
      token,
    }),

  deleteAppointment: async (token: string, appointmentId: number) => {
    try {
      return await request<{ message: string }>(`/admin/appointments/${appointmentId}/delete`, {
        method: 'POST',
        token,
      })
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return request<{ message: string }>(`/admin/appointments/${appointmentId}`, {
          method: 'DELETE',
          token,
        })
      }

      throw error
    }
  },

  getUsers: (token: string) =>
    request<AdminUser[]>('/admin/users', { token }),

  updateUserRole: (token: string, userId: number, role: UserRole) =>
    request<{ message: string }>(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: { role },
      token,
    }),

  deleteUser: (token: string, userId: number) =>
    request<{ message: string }>(`/admin/users/${userId}/delete`, {
      method: 'POST',
      token,
    }),
}
