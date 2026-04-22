import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AppointmentStatus } from '../../types/models'
import { useAuth } from '../useAuth'
import { adminService } from '../../services/admin.service'

export const useAdminBookings = (filters: { date: string; search: string }) => {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const bookingsQuery = useQuery({
    queryKey: ['admin', 'appointments', filters.date, filters.search],
    queryFn: () => adminService.getAppointments(token ?? '', filters.date, filters.search),
    enabled: Boolean(token),
  })

  const updateBookingStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: AppointmentStatus }) =>
      adminService.updateAppointmentStatus(token ?? '', id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'appointments'] })
    },
  })

  const deleteBooking = useMutation({
    mutationFn: (id: number) => adminService.deleteAppointment(token ?? '', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'appointments'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    },
  })

  return { bookingsQuery, updateBookingStatus, deleteBooking }
}
