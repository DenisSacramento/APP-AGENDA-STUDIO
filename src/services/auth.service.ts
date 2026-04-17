import type { AuthResponse } from '../types/models'
import { request } from './http'

export const authService = {
  register: (data: { name: string; email: string; password: string }) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: data }),

  login: (data: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: data }),

  loginAdmin: (data: { email: string; password: string }) =>
    request<AuthResponse>('/admin/login', { method: 'POST', body: data }),

  forgotPassword: (data: { email: string }) =>
    request<{ message: string }>('/auth/forgot-password', { method: 'POST', body: data }),
}
