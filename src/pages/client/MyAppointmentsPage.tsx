import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PageContainer } from '../../components/layout/PageContainer'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { appointmentService } from '../../services/appointment.service'
import { useAuth } from '../../hooks/useAuth'
import { formatDate } from '../../utils/date'

export const MyAppointmentsPage = () => {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: () => appointmentService.getMyAppointments(token ?? ''),
    enabled: Boolean(token),
  })

  const cancelMutation = useMutation({
    mutationFn: (id: number) => appointmentService.cancelAppointment(token ?? '', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] })
    },
  })

  return (
    <PageContainer>
      <h1 className="font-display text-3xl text-rose-900">Meus agendamentos</h1>
      <div className="mt-6 grid gap-4">
        {data?.map((appointment) => (
          <Card key={appointment.id} className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl text-rose-900">{appointment.serviceName}</h2>
                <p className="text-sm text-zinc-600">
                  {formatDate(appointment.date)} as {appointment.time}
                </p>
              </div>
              <Badge status={appointment.status} />
            </div>
            {appointment.status !== 'cancelado' ? (
              <Button variant="danger" onClick={() => cancelMutation.mutate(appointment.id)}>
                Cancelar
              </Button>
            ) : null}
          </Card>
        ))}
      </div>
    </PageContainer>
  )
}
