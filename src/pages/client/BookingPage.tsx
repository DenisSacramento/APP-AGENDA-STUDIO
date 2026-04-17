import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { PageContainer } from '../../components/layout/PageContainer'
import { BookingStepper } from '../../components/booking/BookingStepper'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { appointmentService } from '../../services/appointment.service'
import { useAuth } from '../../hooks/useAuth'
import { todayISO } from '../../utils/date'
import type { Service } from '../../types/models'

const notesSchema = z.string().max(500)

export const BookingPage = () => {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const [selectedTime, setSelectedTime] = useState('')
  const [notes, setNotes] = useState('')
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: appointmentService.getServices,
  })

  const { data: slotsData } = useQuery({
    queryKey: ['slots', selectedDate],
    queryFn: () => appointmentService.getAvailableSlots(selectedDate),
    enabled: Boolean(selectedDate),
  })

  const createMutation = useMutation({
    mutationFn: () => {
      if (!token || !selectedService) {
        throw new Error('Efetue login para continuar')
      }

      notesSchema.parse(notes)

      return appointmentService.createAppointment(token, {
        serviceId: selectedService.id,
        date: selectedDate,
        time: selectedTime,
        notes,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] })
      alert('Agendamento confirmado com sucesso!')
      setStep(1)
      setSelectedService(null)
      setSelectedTime('')
      setNotes('')
    },
    onError: (error) => {
      alert(error instanceof Error ? error.message : 'Falha ao confirmar agendamento')
    },
  })

  const slots = useMemo(() => slotsData?.slots ?? [], [slotsData])

  return (
    <PageContainer>
      <h1 className="font-display text-3xl text-rose-900">Agendar horario</h1>
      <p className="mt-1 text-sm text-zinc-600">Fluxo guiado em 5 etapas.</p>

      <div className="mt-6">
        <BookingStepper step={step} />
      </div>

      <Card className="mt-6">
        {step === 1 ? (
          <div className="space-y-4">
            <h2 className="font-display text-xl text-rose-900">1. Escolha o servico</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {services?.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  className={`rounded-2xl border p-4 text-left ${
                    selectedService?.id === service.id
                      ? 'border-rose-400 bg-rose-50'
                      : 'border-rose-100 bg-white'
                  }`}
                  onClick={() => setSelectedService(service)}
                >
                  <p className="font-semibold text-rose-900">{service.name}</p>
                  <p className="text-sm text-zinc-600">{service.description}</p>
                  <p className="mt-1 text-xs text-zinc-500">{service.durationMinutes} min</p>
                </button>
              ))}
            </div>
            <Button disabled={!selectedService} onClick={() => setStep(2)}>
              Proxima etapa
            </Button>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <h2 className="font-display text-xl text-rose-900">2. Escolha a data</h2>
            <input
              type="date"
              min={todayISO()}
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="rounded-2xl border border-rose-100 px-4 py-3"
            />
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep(1)}>
                Voltar
              </Button>
              <Button onClick={() => setStep(3)}>Proxima etapa</Button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <h2 className="font-display text-xl text-rose-900">3. Escolha o horario</h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={`rounded-full border px-3 py-2 text-sm ${
                    selectedTime === slot
                      ? 'border-rose-500 bg-rose-500 text-white'
                      : 'border-rose-200 bg-white text-zinc-700'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep(2)}>
                Voltar
              </Button>
              <Button disabled={!selectedTime} onClick={() => setStep(4)}>
                Proxima etapa
              </Button>
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-4">
            <h2 className="font-display text-xl text-rose-900">4. Confirmar dados</h2>
            <ul className="space-y-1 text-sm text-zinc-700">
              <li>Servico: {selectedService?.name}</li>
              <li>Data: {selectedDate}</li>
              <li>Hora: {selectedTime}</li>
            </ul>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Observacoes opcionais"
              className="min-h-24 w-full rounded-2xl border border-rose-100 p-3"
            />
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep(3)}>
                Voltar
              </Button>
              <Button onClick={() => setStep(5)}>Ir para finalizacao</Button>
            </div>
          </div>
        ) : null}

        {step === 5 ? (
          <div className="space-y-4">
            <h2 className="font-display text-xl text-rose-900">5. Finalizar</h2>
            <p className="text-sm text-zinc-600">Revise e confirme seu agendamento.</p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep(4)}>
                Voltar
              </Button>
              <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
                Confirmar agendamento
              </Button>
            </div>
          </div>
        ) : null}
      </Card>
    </PageContainer>
  )
}
