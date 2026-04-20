import { cn } from '../../utils/cn'

export type AdminSectionId = 'dashboard' | 'services' | 'appointments' | 'users'

interface AdminSidebarProps {
  active: AdminSectionId
  onChange: (section: AdminSectionId) => void
}

const sections: Array<{ id: AdminSectionId; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'services', label: 'Servicos' },
  { id: 'appointments', label: 'Agendamentos' },
  { id: 'users', label: 'Usuarios' },
]

export const AdminSidebar = ({ active, onChange }: AdminSidebarProps) => (
  <aside className="rounded-3xl border border-rose-100 bg-white/85 p-3 shadow-sm">
    <nav className="flex gap-2 overflow-x-auto lg:flex-col">
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => onChange(section.id)}
          className={cn(
            'rounded-2xl px-4 py-3 text-left text-sm font-semibold transition',
            active === section.id
              ? 'bg-rose-500 text-white shadow-[0_10px_20px_rgba(244,63,94,0.25)]'
              : 'bg-rose-50 text-rose-900 hover:bg-rose-100',
          )}
        >
          {section.label}
        </button>
      ))}
    </nav>
  </aside>
)
