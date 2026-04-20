import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AdminServicePayload } from '../../types/models'
import { useAuth } from '../useAuth'
import { adminService } from '../../services/admin.service'

export const useAdminServices = () => {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const servicesQuery = useQuery({
    queryKey: ['admin', 'services'],
    queryFn: () => adminService.getServices(token ?? ''),
    enabled: Boolean(token),
  })

  const createService = useMutation({
    mutationFn: (payload: AdminServicePayload) => adminService.createService(token ?? '', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })

  const updateService = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminServicePayload }) =>
      adminService.updateService(token ?? '', id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] })
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })

  const deleteService = useMutation({
    mutationFn: (id: number) => adminService.deleteService(token ?? '', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })

  return {
    servicesQuery,
    createService,
    updateService,
    deleteService,
  }
}
