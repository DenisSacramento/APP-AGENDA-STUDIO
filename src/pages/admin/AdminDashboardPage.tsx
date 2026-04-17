import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PageContainer } from '../../components/layout/PageContainer'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { appointmentService } from '../../services/appointment.service'
import { useAuth } from '../../hooks/useAuth'
import type { AppointmentStatus } from '../../types/models'

export const AdminDashboardPage = () => {
  const { token } = useAuth()
  const [date, setDate] = useState('')
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['admin-appointments', date, search],
    queryFn: () => appointmentService.getAdminAppointments(token ?? '', date, search),
    enabled: Boolean(token),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: AppointmentStatus }) =>
      appointmentService.updateAdminAppointmentStatus(token ?? '', id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] })
    },
  })

  return (
    <PageContainer>
      <h1 className="font-display text-3xl text-rose-900">Dashboard admin</h1>

      <Card className="mt-6 space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <Input label="Filtrar por data" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          <Input
            label="Buscar cliente"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nome ou email"
          />
          <div className="flex items-end">
            <Button variant="ghost" onClick={() => { setDate(''); setSearch('') }}>
              Limpar filtros
            </Button>
          </div>
        </div>
      </Card>

      <section className="mt-6 grid gap-4">
        {data?.map((appointment) => (
          <Card key={appointment.id} className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-xl text-rose-900">{appointment.clientName}</h2>
                <p className="text-sm text-zinc-600">{appointment.clientEmail}</p>
                <p className="text-sm text-zinc-700">
                  {appointment.serviceName} • {appointment.date} as {appointment.time}
                </p>
              </div>
              <Badge status={appointment.status} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => statusMutation.mutate({ id: appointment.id, status: 'confirmado' })}>
                Confirmar
              </Button>
              <Button variant="danger" onClick={() => statusMutation.mutate({ id: appointment.id, status: 'cancelado' })}>
                Cancelar
              </Button>
              <Button variant="secondary" onClick={() => statusMutation.mutate({ id: appointment.id, status: 'pendente' })}>
                Marcar pendente
              </Button>
            </div>
          </Card>
        ))}
      </section>
    </PageContainer>
  )
}
