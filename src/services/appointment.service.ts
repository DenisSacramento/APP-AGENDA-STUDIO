import type { AdminAppointment, Appointment, AppointmentStatus, Offer, Service } from '../types/models'
import { request } from './http'

export const appointmentService = {
  getServices: () => request<Service[]>('/appointments/services'),

  getOffers: () => request<Offer[]>('/appointments/offers'),

  getAvailableSlots: (date: string) => request<{ slots: string[] }>(`/appointments/slots?date=${date}`),

  createAppointment: (
    token: string,
    payload: { serviceId: number; date: string; time: string; notes?: string },
  ) => request<{ id: number; message: string }>('/appointments', { method: 'POST', body: payload, token }),

  getMyAppointments: (token: string) => request<Appointment[]>('/appointments/me', { token }),

  cancelAppointment: (token: string, id: number) =>
    request<{ message: string }>(`/appointments/${id}/cancel`, { method: 'PATCH', token }),

  getAdminAppointments: (token: string, date?: string, search?: string) => {
    const query = new URLSearchParams()
    if (date) query.set('date', date)
    if (search) query.set('search', search)

    return request<AdminAppointment[]>(`/admin/appointments?${query.toString()}`, { token })
  },

  updateAdminAppointmentStatus: (token: string, id: number, status: AppointmentStatus) =>
    request<{ message: string }>(`/admin/appointments/${id}/status`, {
      method: 'PATCH',
      body: { status },
      token,
    }),
}
