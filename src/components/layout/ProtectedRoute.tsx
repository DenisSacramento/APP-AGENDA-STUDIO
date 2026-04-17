import { Navigate } from 'react-router-dom'
import type { PropsWithChildren } from 'react'
import { useAuth } from '../../hooks/useAuth'
import type { UserRole } from '../../types/models'

export const ProtectedRoute = ({ children, role }: PropsWithChildren<{ role?: UserRole }>) => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }

  return children
}
