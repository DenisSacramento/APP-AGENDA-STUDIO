import { useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { PageContainer } from '../../components/layout/PageContainer'
import { BookingStepper } from '../../components/booking/BookingStepper'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { appointmentService } from '../../services/appointment.service'
import { ApiError } from '../../services/http'
import { useAuth } from '../../hooks/useAuth'
import { todayISO } from '../../utils/date'
import dayjs from 'dayjs'
import type { Service } from '../../types/models'

const notesSchema = z.string().max(500)

export const BookingPage = () => {
  const [step, setStep] = useState(2)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const [selectedTime, setSelectedTime] = useState('')
  const [notes, setNotes] = useState('')
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: appointmentService.getServices,
  })

  const location = useLocation()

  // If a serviceId is passed via location.state (from ServicesPage), preselect and jump to date step
  useEffect(() => {
    const stateAny = location.state as any
    const serviceIdFromState = stateAny?.serviceId
    if (serviceIdFromState && services && !selectedService) {
      const found = services.find((s) => s.id === serviceIdFromState)
      if (found) {
        setSelectedService(found)
        setStep(2)
      }
    }
  }, [location.state, services])

  // If page loaded without a serviceId (and services already fetched), redirect
  // back to services — booking must start from a selected service.
  useEffect(() => {
    const stateAny = location.state as any
    const serviceIdFromState = stateAny?.serviceId
    if (!services) return
    if (!serviceIdFromState && !selectedService) {
      navigate('/services')
    }
  }, [services, selectedService, location.state, navigate])

  // preselection via ServicesPage handled in useEffect above

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

      // checar expiração do token localmente antes de enviar
      try {
        const parts = token.split('.')
        if (parts.length >= 2) {
          const payload = JSON.parse(atob(parts[1]))
          if (payload && typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()) {
            // token expirado localmente
            logout()
            navigate('/login')
            throw new Error('Sessão expirada. Faça login novamente.')
          }
        }
      } catch {
        // se falhar ao decodificar, deixamos o envio prosseguir e tratamos 401 no onError
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
      // se receber 401 do servidor, forçar logout e redirecionar para login
      if (error instanceof ApiError && error.status === 401) {
        try {
          logout()
        } finally {
          navigate('/login')
        }
      }
      alert(error instanceof Error ? error.message : 'Falha ao confirmar agendamento')
    },
  })

  const slots = useMemo(() => {
    const all = slotsData?.slots ?? []
    if (!selectedDate) return all
    const today = todayISO()
    if (selectedDate !== today) return all

    const now = dayjs()
    return all.filter((slot) => {
      const slotDate = dayjs(`${selectedDate}T${slot}:00`)
      return slotDate.isAfter(now)
    })
  }, [slotsData, selectedDate])
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(value)

  return (
    <PageContainer>
      <section className="mx-auto max-w-4xl py-6">
        <header className="mb-6">
          <h1 className="text-[28px] font-black text-[#8e005f] sm:text-[38px]">Agendar horário</h1>
          <p className="mt-2 text-sm text-zinc-600">Escolha a data e o horário para o serviço selecionado</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <main className="lg:col-span-2">
            <BookingStepper step={step} />

            <Card className="mt-6">
              {step === 2 ? (
                <div className="space-y-4">
                  <h2 className="font-display text-xl text-rose-900">2. Escolha a data</h2>
                  <input
                    type="date"
                    min={todayISO()}
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                    className="w-full rounded-2xl border border-rose-100 px-4 py-3 text-base"
                  />
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => navigate('/services')}>
                      Voltar
                    </Button>
                    <Button onClick={() => setStep(3)}>Próxima etapa</Button>
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="space-y-4">
                  <h2 className="font-display text-xl text-rose-900">3. Escolha o horário</h2>
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
                    <Button disabled={!selectedTime} onClick={() => createMutation.mutate()}>
                      Confirmar agendamento
                    </Button>
                  </div>
                </div>
              ) : null}
            </Card>
          </main>

          <aside className="lg:col-span-1">
            {selectedService ? (
              <Card className="sticky top-24">
                <h3 className="font-display text-lg text-rose-900">{selectedService.name}</h3>
                <p className="mt-2 text-sm text-zinc-600">{selectedService.description}</p>
                <p className="mt-3 text-sm text-[#7b6481]">{selectedService.durationMinutes} min</p>
                <p className="mt-2 text-base font-bold text-[#8e005f]">{formatCurrency(Number(selectedService.price ?? 0))}</p>
                <Button variant="ghost" className="mt-4 w-full" onClick={() => navigate('/services')}>
                  Alterar serviço
                </Button>
              </Card>
            ) : (
              <Card className="sticky top-24">
                <p className="text-sm text-zinc-600">Nenhum serviço selecionado. Volte para a lista de serviços.</p>
                <Button className="mt-4 w-full" onClick={() => navigate('/services')}>
                  Ver serviços
                </Button>
              </Card>
            )}
          </aside>
        </div>
      </section>
    </PageContainer>
  )
}
