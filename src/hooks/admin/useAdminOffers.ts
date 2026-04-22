import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AdminOfferPayload } from '../../types/models'
import { useAuth } from '../useAuth'
import { adminService } from '../../services/admin.service'

export const useAdminOffers = () => {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const offersQuery = useQuery({
    queryKey: ['admin', 'offers'],
    queryFn: () => adminService.getOffers(token ?? ''),
    enabled: Boolean(token),
  })

  const createOffer = useMutation({
    mutationFn: (payload: AdminOfferPayload) => adminService.createOffer(token ?? '', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'offers'] })
      queryClient.invalidateQueries({ queryKey: ['offers'] })
    },
  })

  const deleteOffer = useMutation({
    mutationFn: (id: number) => adminService.deleteOffer(token ?? '', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'offers'] })
      queryClient.invalidateQueries({ queryKey: ['offers'] })
    },
  })

  return { offersQuery, createOffer, deleteOffer }
}
