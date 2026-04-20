import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../useAuth'
import { adminService } from '../../services/admin.service'

export const useAdminDashboard = () => {
  const { token } = useAuth()

  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminService.getDashboardSummary(token ?? ''),
    enabled: Boolean(token),
  })
}
