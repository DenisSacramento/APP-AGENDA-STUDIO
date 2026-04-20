import type { AuthResponse } from '../types/models'
import { request } from './http'

export const authService = {
  register: (data: { name: string; email: string; password: string }) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: data }),

  login: (data: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: data }),

  // Use the regular auth login for admin login as well so users with role
  // 'admin' stored in the database can authenticate from the admin UI.
  loginAdmin: (data: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: data }),

  forgotPassword: (data: { email: string }) =>
    request<{ message: string }>('/auth/forgot-password', { method: 'POST', body: data }),
}
