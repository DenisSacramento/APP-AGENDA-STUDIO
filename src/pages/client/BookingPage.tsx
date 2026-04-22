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
type BookingLocationState = { serviceId?: number; offerPrice?: number; offerId?: number }

export const BookingPage = () => {
  const [step, setStep] = useState(2)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [appliedOfferPrice, setAppliedOfferPrice] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const [selectedTime, setSelectedTime] = useState('')
  const [notes, setNotes] = useState('')
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: appointmentService.getServices,
  })

  const location = useLocation()

  useEffect(() => {
    const stateAny = location.state as BookingLocationState | undefined
    const serviceIdFromState = stateAny?.serviceId
    const offerPriceFromState = stateAny?.offerPrice
    if (serviceIdFromState && services && !selectedService) {
      const found = services.find((s) => Number(s.id) === Number(serviceIdFromState))
      if (found) {
        setSelectedService(found)
        setStep(2)
        if (typeof offerPriceFromState === 'number') setAppliedOfferPrice(offerPriceFromState)
      }
    }
  }, [location.state, services, selectedService])

  useEffect(() => {
    const stateAny = location.state as BookingLocationState | undefined
    const serviceIdFromState = stateAny?.serviceId
    if (!services) return
    if (!serviceIdFromState && !selectedService) {
      navigate('/services')
    }
  }, [services, selectedService, location.state, navigate])

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

      try {
        const parts = token.split('.')
        if (parts.length >= 2) {
          const payload = JSON.parse(atob(parts[1]))
          if (payload && typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()) {
            logout()
            navigate('/login')
            throw new Error('Sessao expirada. Faca login novamente.')
          }
        }
      } catch {
        // Keep the request flow intact and let 401 be handled in onError.
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
      setShowSuccessPopup(true)
      setStep(1)
      setSelectedService(null)
      setSelectedTime('')
      setNotes('')
    },
    onError: (error) => {
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

  const panelClass =
    'rounded-3xl border border-[#ddb1cf] bg-[#f1e6f3] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_8px_18px_rgba(87,52,73,0.08)] sm:p-6'
  const sectionTitleClass = 'text-[20px] font-extrabold uppercase tracking-[0.06em] text-[#34263f] sm:text-[22px]'

  return (
    <PageContainer>
      {showSuccessPopup ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d1027]/45 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-[32px] border border-[#ddb1cf] bg-[linear-gradient(180deg,#fffafc_0%,#f4e5f1_100%)] p-6 text-center shadow-[0_20px_60px_rgba(87,52,73,0.26)] sm:p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f7d8e9] text-[28px] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
              <span aria-hidden="true">✓</span>
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#8e005f]">Agendamento confirmado</p>
            <h2 className="mt-3 text-[28px] font-black uppercase tracking-[0.08em] text-[#8e005f]">Obrigada!</h2>
            <p className="mt-3 text-base leading-relaxed text-[#6c5574]">
              Seu horario foi reservado com sucesso. Agradecemos pela confianca e esperamos voce no Studio Karine Reverte.
            </p>
            <Button className="mt-6 w-full" onClick={() => setShowSuccessPopup(false)}>
              Fechar mensagem
            </Button>
          </div>
        </div>
      ) : null}

      <section className="mx-auto max-w-5xl py-6 sm:py-8">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8e005f] sm:text-base">Reserva online</p>
          <h1 className="mt-3 text-[28px] font-black uppercase tracking-[0.12em] text-[#8e005f] sm:text-[38px]">Agendar horario</h1>
          <p className="mt-3 text-base leading-relaxed text-[#68607d]">
            Escolha a data e o horario para finalizar o agendamento do servico selecionado.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_340px]">
          <main className="min-w-0">
            <div className={panelClass}>
              <BookingStepper step={step} />
            </div>

            <Card className={`mt-6 ${panelClass}`}>
              {step === 2 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h2 className={sectionTitleClass}>2. Escolha a data</h2>
                    <p className="text-sm leading-relaxed text-[#6c5574]">Selecione um dia disponivel para continuar para os horarios.</p>
                  </div>

                  <input
                    type="date"
                    min={todayISO()}
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                    className="w-full rounded-2xl border border-[#d8bfd1] bg-white px-4 py-3 text-base text-[#34263f] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition focus:border-[#b83286] focus:ring-2 focus:ring-[#e7bfd7]"
                  />

                  <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                    <Button variant="ghost" onClick={() => navigate('/services')}>
                      Voltar
                    </Button>
                    <Button onClick={() => setStep(3)}>Proxima etapa</Button>
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h2 className={sectionTitleClass}>3. Escolha o horario</h2>
                    <p className="text-sm leading-relaxed text-[#6c5574]">Os horarios exibidos abaixo consideram apenas os periodos disponiveis.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                    {slots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                          selectedTime === slot
                            ? 'border-[#b83286] bg-[#b83286] text-white shadow-[0_8px_18px_rgba(140,0,95,0.22)]'
                            : 'border-[#d8bfd1] bg-white text-[#5d4a67] hover:border-[#c98cb3] hover:bg-[#fff8fc]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  {slots.length === 0 ? (
                    <p className="rounded-2xl border border-[#d9c8d5] bg-white/70 px-4 py-3 text-sm text-[#6c5574]">
                      Nao ha horarios disponiveis para a data escolhida.
                    </p>
                  ) : null}

                  <div className="flex flex-col gap-2 pt-2 sm:flex-row">
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

          <aside className="min-w-0">
            {selectedService ? (
              <Card className={`sticky top-24 ${panelClass}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8e005f]">Resumo do servico</p>
                <h3 className="mt-3 text-[20px] font-extrabold uppercase leading-snug tracking-[0.04em] text-[#34263f]">
                  {selectedService.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6c5574]">{selectedService.description}</p>

                <div className="mt-5 grid gap-3 rounded-2xl border border-[#e2cbda] bg-white/70 p-4">
                  <p className="text-sm text-[#7b6481]">{selectedService.durationMinutes} min</p>
                  {appliedOfferPrice ? (
                    <div>
                      <p className="text-sm text-[#7b6481] line-through">{formatCurrency(Number(selectedService.price ?? 0))}</p>
                      <p className="text-base font-bold text-[#8e005f]">{formatCurrency(Number(appliedOfferPrice))}</p>
                    </div>
                  ) : (
                    <p className="text-base font-bold text-[#8e005f]">{formatCurrency(Number(selectedService.price ?? 0))}</p>
                  )}
                </div>

                <div className="mt-5 rounded-2xl border border-dashed border-[#d8bfd1] bg-white/50 px-4 py-3 text-sm leading-relaxed text-[#6c5574]">
                  Revise os dados antes de confirmar para evitar remarcoes.
                </div>

                <Button variant="ghost" className="mt-4 w-full" onClick={() => navigate('/services')}>
                  Alterar servico
                </Button>
              </Card>
            ) : (
              <Card className={`sticky top-24 ${panelClass}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8e005f]">Resumo do servico</p>
                <p className="mt-3 text-sm leading-relaxed text-[#6c5574]">Nenhum servico selecionado. Volte para a lista e escolha uma opcao para continuar.</p>
                <Button className="mt-4 w-full" onClick={() => navigate('/services')}>
                  Ver servicos
                </Button>
              </Card>
            )}
          </aside>
        </div>
      </section>
    </PageContainer>
  )
}
