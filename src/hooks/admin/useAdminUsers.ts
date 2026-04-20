import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UserRole } from '../../types/models'
import { useAuth } from '../useAuth'
import { adminService } from '../../services/admin.service'

export const useAdminUsers = () => {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const usersQuery = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminService.getUsers(token ?? ''),
    enabled: Boolean(token),
  })

  const updateUserRole = useMutation({
    mutationFn: ({ id, role }: { id: number; role: UserRole }) =>
      adminService.updateUserRole(token ?? '', id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    },
  })

  return { usersQuery, updateUserRole }
}
