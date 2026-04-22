import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { AdminSidebar, type AdminSectionId } from '../../components/admin/AdminSidebar'
import { AdminStatCard } from '../../components/admin/AdminStatCard'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { Toast } from '../../components/ui/Toast'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { PageContainer } from '../../components/layout/PageContainer'
import { useAdminDashboard } from '../../hooks/admin/useAdminDashboard'
import { useAdminServices } from '../../hooks/admin/useAdminServices'
import { useAdminBookings } from '../../hooks/admin/useAdminBookings'
import { useAdminOffers } from '../../hooks/admin/useAdminOffers'
import { useAdminUsers } from '../../hooks/admin/useAdminUsers'
import { ApiError } from '../../services/http'
import type { AdminService } from '../../types/models'
import { formatDate } from '../../utils/date'

const toCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)

const toDisplayDate = (value: string) => {
  const formatted = formatDate(value)
  return formatted === 'Invalid Date' ? value.split('T')[0] : formatted
}

const defaultServiceForm = {
  name: '',
  description: '',
  durationMinutes: '60',
  price: '0',
}

const defaultOfferForm = {
  serviceName: '',
  offerPrice: '0',
}

export const AdminDashboardPage = () => {
  const [activeSection, setActiveSection] = useState<AdminSectionId>('dashboard')
  const [serviceForm, setServiceForm] = useState(defaultServiceForm)
  const [offerForm, setOfferForm] = useState(defaultOfferForm)
  const [editingService, setEditingService] = useState<AdminService | null>(null)
  const [bookingDate, setBookingDate] = useState('')
  const [bookingSearch, setBookingSearch] = useState('')
  const [toast, setToast] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({
    open: false,
    message: '',
    type: 'success',
  })
  const [confirmAction, setConfirmAction] = useState<
    | { type: 'deleteService'; id: number; name: string }
    | { type: 'deleteAppointment'; id: number; name: string }
    | { type: 'deleteOffer'; id: number; name: string }
    | { type: 'deleteUser'; id: number; name: string }
    | null
  >(null)
  const serviceFormRef = useRef<HTMLDivElement | null>(null)

  const { data: summary } = useAdminDashboard()
  const { servicesQuery, createService, updateService, deleteService } = useAdminServices()
  const { bookingsQuery, updateBookingStatus, deleteBooking } = useAdminBookings({ date: bookingDate, search: bookingSearch })
  const { offersQuery, createOffer, deleteOffer } = useAdminOffers()
  const { usersQuery, deleteUser } = useAdminUsers()

  const sectionTitle = useMemo(() => {
    if (activeSection === 'dashboard') return 'Controle de agendas'
    if (activeSection === 'services') return 'Gestão de serviços'
    if (activeSection === 'appointments') return 'Gestão de agendamentos'
    if (activeSection === 'offers') return 'Gestão de ofertas'
    return 'Gestão de usuários'
  }, [activeSection])

  const submitServiceForm = async (event: FormEvent) => {
    event.preventDefault()

    const payload = {
      name: serviceForm.name.trim(),
      description: serviceForm.description.trim(),
      durationMinutes: Number(serviceForm.durationMinutes),
      price: Number(serviceForm.price),
    }

    if (editingService) {
      await updateService.mutateAsync({ id: editingService.id, payload })
    } else {
      await createService.mutateAsync(payload)
    }

    setServiceForm(defaultServiceForm)
    setEditingService(null)
  }

  const submitOfferForm = async (event: FormEvent) => {
    event.preventDefault()
    await createOffer.mutateAsync({
      serviceName: offerForm.serviceName.trim(),
      offerPrice: Number(offerForm.offerPrice),
    })
    setOfferForm(defaultOfferForm)
  }

  const startEditService = (service: AdminService) => {
    setEditingService(service)
    setServiceForm({
      name: service.name,
      description: service.description,
      durationMinutes: String(service.durationMinutes),
      price: String(service.price),
    })
    setActiveSection('services')
  }

  useEffect(() => {
    if (!toast.open) return
    const timeout = window.setTimeout(() => {
      setToast((current) => ({ ...current, open: false }))
    }, 3000)
    return () => window.clearTimeout(timeout)
  }, [toast.open])

  useEffect(() => {
    if (activeSection !== 'services' || !editingService) return
    requestAnimationFrame(() => {
      serviceFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [activeSection, editingService])

  const confirmPending =
    confirmAction?.type === 'deleteService'
      ? deleteService.isPending
      : confirmAction?.type === 'deleteAppointment'
        ? deleteBooking.isPending
        : confirmAction?.type === 'deleteOffer'
          ? deleteOffer.isPending
          : confirmAction?.type === 'deleteUser'
            ? deleteUser.isPending
            : false

  const handleConfirmAction = () => {
    if (!confirmAction) return

    if (confirmAction.type === 'deleteService') {
      deleteService.mutate(confirmAction.id)
      setConfirmAction(null)
      return
    }

    if (confirmAction.type === 'deleteAppointment') {
      deleteBooking.mutate(confirmAction.id, {
        onSuccess: () => setToast({ open: true, message: 'Agendamento excluído com sucesso.', type: 'success' }),
        onError: (error) => {
          const message = error instanceof ApiError ? error.message : 'Não foi possível excluir o agendamento.'
          setToast({ open: true, message, type: 'error' })
        },
        onSettled: () => setConfirmAction(null),
      })
      return
    }

    if (confirmAction.type === 'deleteOffer') {
      deleteOffer.mutate(confirmAction.id, {
        onSuccess: () => setToast({ open: true, message: 'Oferta removida com sucesso.', type: 'success' }),
        onError: (error) => {
          const message = error instanceof ApiError ? error.message : 'Não foi possível remover a oferta.'
          setToast({ open: true, message, type: 'error' })
        },
        onSettled: () => setConfirmAction(null),
      })
      return
    }

    deleteUser.mutate(confirmAction.id, {
      onSuccess: () => setToast({ open: true, message: 'Usuário excluído com sucesso.', type: 'success' }),
      onError: (error) => {
        const message = error instanceof ApiError ? error.message : 'Não foi possível excluir o usuário.'
        setToast({ open: true, message, type: 'error' })
      },
      onSettled: () => setConfirmAction(null),
    })
  }

  return (
    <PageContainer>
      <div className="space-y-5 sm:space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">Painel administrativo</p>
          <h2 className="mt-2 text-[21px] font-black uppercase tracking-[0.08em] text-[#8e005f] sm:mt-3 sm:text-[32px] sm:tracking-[0.12em]">
            {sectionTitle}
          </h2>
        </header>

        <div className="grid gap-4 lg:grid-cols-[224px_minmax(0,1fr)]">
          <AdminSidebar active={activeSection} onChange={setActiveSection} />

          <section className="min-w-0 space-y-4">
            {activeSection === 'dashboard' ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AdminStatCard title="Total de usuários" value={summary?.totalUsers ?? 0} />
                <AdminStatCard title="Total de serviços ativos" value={summary?.totalServices ?? 0} />
                <AdminStatCard title="Total de agendamentos" value={summary?.totalAppointments ?? 0} />
              </div>
            ) : null}

            {activeSection === 'services' ? (
              <div className="space-y-4">
                <div ref={serviceFormRef}>
                  <Card>
                    <div className="mb-4 space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8e005f]">Gestão de serviços</p>
                      <h3 className="text-[20px] font-extrabold uppercase tracking-[0.06em] text-[#5a4566]">
                        {editingService ? 'Editar serviço' : 'Novo serviço'}
                      </h3>
                    </div>
                    <form className="grid gap-3 md:grid-cols-2" onSubmit={submitServiceForm}>
                      <Input label="Nome" value={serviceForm.name} onChange={(event) => setServiceForm((current) => ({ ...current, name: event.target.value }))} required />
                      <Input label="Duração (min)" type="number" min={1} value={serviceForm.durationMinutes} onChange={(event) => setServiceForm((current) => ({ ...current, durationMinutes: event.target.value }))} required />
                      <label className="md:col-span-2">
                        <span className="mb-2 block text-sm font-medium text-[#6c5574]">Descrição</span>
                        <textarea
                          className="w-full rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-300"
                          rows={3}
                          value={serviceForm.description}
                          onChange={(event) => setServiceForm((current) => ({ ...current, description: event.target.value }))}
                          required
                        />
                      </label>
                      <Input label="Preço (R$)" type="number" min={0} step="0.01" value={serviceForm.price} onChange={(event) => setServiceForm((current) => ({ ...current, price: event.target.value }))} required />
                      <div className="flex flex-wrap items-end gap-2 md:col-span-2">
                        <Button className="w-full sm:w-auto" type="submit" disabled={createService.isPending || updateService.isPending}>
                          {editingService ? 'Salvar alterações' : 'Criar serviço'}
                        </Button>
                        {editingService ? (
                          <Button
                            type="button"
                            variant="ghost"
                            className="w-full sm:w-auto"
                            onClick={() => {
                              setEditingService(null)
                              setServiceForm(defaultServiceForm)
                            }}
                          >
                            Cancelar edição
                          </Button>
                        ) : null}
                      </div>
                    </form>
                  </Card>
                </div>

                <div className="grid gap-3">
                  {servicesQuery.data?.map((service) => (
                    <Card key={service.id} className="w-full max-w-full space-y-3 overflow-hidden">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8e005f]">Serviço</p>
                          <h3 className="mt-1 break-words text-[20px] font-extrabold uppercase tracking-[0.03em] text-[#5a4566]">{service.name}</h3>
                          <p className="mt-1 break-words text-sm text-[#6c5574]">{service.description}</p>
                          <p className="mt-1 text-sm font-medium text-[#6c5574]">{service.durationMinutes} min • {toCurrency(Number(service.price))}</p>
                        </div>
                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.06em] text-zinc-600">{service.isActive ? 'Ativo' : 'Inativo'}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button className="w-full sm:w-auto" variant="secondary" onClick={() => startEditService(service)}>
                          Editar
                        </Button>
                        <Button className="w-full sm:w-auto" variant="danger" disabled={deleteService.isPending || service.isActive === 0} onClick={() => setConfirmAction({ type: 'deleteService', id: service.id, name: service.name })}>
                          Deletar
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : null}

            {activeSection === 'appointments' ? (
              <div className="space-y-4">
                <Card>
                  <div className="mb-4 space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8e005f]">Filtros de agendamento</p>
                    <h3 className="text-[20px] font-extrabold uppercase tracking-[0.06em] text-[#5a4566]">Buscar e filtrar</h3>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <Input label="Filtrar por data" type="date" value={bookingDate} onChange={(event) => setBookingDate(event.target.value)} />
                    <Input label="Buscar cliente" value={bookingSearch} placeholder="Nome ou email" onChange={(event) => setBookingSearch(event.target.value)} />
                    <div className="flex items-end">
                      <Button variant="ghost" onClick={() => { setBookingDate(''); setBookingSearch('') }}>Limpar filtros</Button>
                    </div>
                  </div>
                </Card>

                <div className="grid gap-3">
                  {bookingsQuery.data?.map((appointment) => (
                    <Card key={appointment.id} className="w-full max-w-full space-y-3 overflow-hidden">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8e005f]">Cliente</p>
                          <h3 className="mt-1 break-words text-[20px] font-extrabold uppercase tracking-[0.03em] text-[#5a4566]">{appointment.clientName}</h3>
                          <p className="mt-1 break-all text-sm font-medium text-[#6c5574]">{appointment.clientEmail}</p>
                          <p className="mt-1 break-words text-sm text-[#6c5574]">{appointment.serviceName} • {toDisplayDate(appointment.date)} as {appointment.time}</p>
                        </div>
                        <div className="shrink-0">
                          <Badge status={appointment.status} />
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8e005f]">Atualizar status</span>
                        <select
                          className="w-full rounded-xl border border-[#d8bfd1] bg-white px-3 py-2 text-sm font-medium text-[#5a4566] outline-none transition focus:border-[#b83286] focus:ring-2 focus:ring-[#e7bfd7] sm:w-auto"
                          value={appointment.status}
                          onChange={(event) => {
                            if (event.target.value === 'excluir') {
                              setConfirmAction({ type: 'deleteAppointment', id: appointment.id, name: `${appointment.clientName} ${appointment.serviceName}` })
                              return
                            }
                            updateBookingStatus.mutate({ id: appointment.id, status: event.target.value as 'pendente' | 'confirmado' | 'cancelado' })
                          }}
                        >
                          <option value="pendente">Pendente</option>
                          <option value="confirmado">Confirmado</option>
                          <option value="cancelado">Cancelado</option>
                          <option value="excluir">Excluir</option>
                        </select>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : null}

            {activeSection === 'offers' ? (
              <div className="space-y-4">
                <Card>
                  <div className="mb-4 space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8e005f]">Gestão de ofertas</p>
                    <h3 className="text-[20px] font-extrabold uppercase tracking-[0.06em] text-[#5a4566]">Nova oferta</h3>
                  </div>
                  <form className="grid gap-3 md:grid-cols-2" onSubmit={submitOfferForm}>
                    <Input label="Serviço" value={offerForm.serviceName} onChange={(event) => setOfferForm((current) => ({ ...current, serviceName: event.target.value }))} required />
                    <Input
                      label="Preço da oferta (R$)"
                      type="number"
                      min={0}
                      step="0.01"
                      value={offerForm.offerPrice}
                      onChange={(event) => setOfferForm((current) => ({ ...current, offerPrice: event.target.value }))}
                      required
                    />
                    <div className="md:col-span-2">
                      <Button type="submit" className="w-full sm:w-auto" disabled={createOffer.isPending}>
                        Adicionar oferta
                      </Button>
                    </div>
                  </form>
                </Card>

                <div className="grid gap-3">
                  {offersQuery.data?.map((offer) => (
                    <Card key={offer.id} className="w-full max-w-full space-y-3 overflow-hidden">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8e005f]">Oferta</p>
                          <h3 className="mt-1 break-words text-[20px] font-extrabold uppercase tracking-[0.03em] text-[#5a4566]">{offer.serviceName}</h3>
                          <p className="mt-1 text-sm font-medium text-[#6c5574]">{toCurrency(Number(offer.offerPrice))}</p>
                        </div>
                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.06em] text-zinc-600">{offer.isActive ? 'Ativa' : 'Inativa'}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button className="w-full sm:w-auto" variant="danger" disabled={deleteOffer.isPending || offer.isActive === 0} onClick={() => setConfirmAction({ type: 'deleteOffer', id: offer.id, name: offer.serviceName })}>
                          Excluir oferta
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : null}

            {activeSection === 'users' ? (
              <div className="grid gap-3">
                <Card>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8e005f]">Gestão de usuários</p>
                  <h3 className="mt-1 text-[20px] font-extrabold uppercase tracking-[0.06em] text-[#5a4566]">Contas cadastradas</h3>
                </Card>
                {usersQuery.data?.map((user) => (
                  <Card key={user.id} className="flex w-full max-w-full flex-wrap items-center justify-between gap-3 overflow-hidden">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8e005f]">Usuário</p>
                      <h3 className="mt-1 break-words text-[20px] font-extrabold uppercase tracking-[0.03em] text-[#5a4566]">{user.name}</h3>
                      <p className="mt-1 break-all text-sm font-medium text-[#6c5574]">{user.email}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#8e005f]">Perfil: {user.role === 'admin' ? 'Admin' : 'Comum'}</p>
                    </div>
                    <Button className="w-full sm:w-auto" variant="danger" disabled={deleteUser.isPending || user.role === 'admin'} onClick={() => setConfirmAction({ type: 'deleteUser', id: user.id, name: user.name })}>
                      {user.role === 'admin' ? 'Admin protegido' : 'Excluir usuário'}
                    </Button>
                  </Card>
                ))}
              </div>
            ) : null}
          </section>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(confirmAction)}
        title={
          confirmAction?.type === 'deleteService'
            ? 'Excluir serviço'
            : confirmAction?.type === 'deleteAppointment'
              ? 'Excluir agendamento'
              : confirmAction?.type === 'deleteOffer'
                ? 'Excluir oferta'
                : 'Excluir usuário'
        }
        message={
          confirmAction?.type === 'deleteService'
            ? `Deseja remover o serviço "${confirmAction.name}"?`
            : confirmAction?.type === 'deleteAppointment'
              ? `Deseja excluir o agendamento de ${confirmAction?.name}? Essa ação não pode ser desfeita.`
              : confirmAction?.type === 'deleteOffer'
                ? `Deseja excluir a oferta de ${confirmAction?.name}? Essa ação não pode ser desfeita.`
                : `Deseja excluir o usuário "${confirmAction?.name}"? Essa ação não pode ser desfeita.`
        }
        confirmLabel={
          confirmAction?.type === 'deleteService'
            ? 'Excluir serviço'
            : confirmAction?.type === 'deleteAppointment'
              ? 'Excluir agendamento'
              : confirmAction?.type === 'deleteOffer'
                ? 'Excluir oferta'
                : 'Excluir usuário'
        }
        cancelLabel="Cancelar"
        isPending={confirmPending}
        onCancel={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
      />

      <Toast open={toast.open} message={toast.message} type={toast.type} />
    </PageContainer>
  )
}
