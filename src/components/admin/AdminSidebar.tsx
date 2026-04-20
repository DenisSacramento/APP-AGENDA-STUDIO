import { cn } from '../../utils/cn'

export type AdminSectionId = 'dashboard' | 'services' | 'appointments' | 'users'

interface AdminSidebarProps {
  active: AdminSectionId
  onChange: (section: AdminSectionId) => void
}

const sections: Array<{ id: AdminSectionId; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'services', label: 'Serviços' },
  { id: 'appointments', label: 'Agendamentos' },
  { id: 'users', label: 'Usuários' },
]

export const AdminSidebar = ({ active, onChange }: AdminSidebarProps) => (
  <aside className="rounded-3xl border border-[#ddb1cf] bg-[#f1e6f3] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_8px_18px_rgba(87,52,73,0.08)] sm:p-6">
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
