import { cn } from '../../utils/cn'
import type { AppointmentStatus } from '../../types/models'

const statusClass: Record<AppointmentStatus, string> = {
  pendente: 'bg-amber-100 text-amber-900',
  confirmado: 'bg-emerald-100 text-emerald-900',
  cancelado: 'bg-zinc-200 text-zinc-700',
}

export const Badge = ({ status }: { status: AppointmentStatus }) => (
  <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize', statusClass[status])}>
    {status}
  </span>
)
