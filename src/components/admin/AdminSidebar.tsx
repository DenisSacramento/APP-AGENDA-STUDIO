import { cn } from '../../utils/cn'

export type AdminSectionId = 'dashboard' | 'services' | 'appointments' | 'offers' | 'users'

interface AdminSidebarProps {
  active: AdminSectionId
  onChange: (section: AdminSectionId) => void
}

const sections: Array<{ id: AdminSectionId; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'services', label: 'Serviços' },
  { id: 'appointments', label: 'Agendamentos' },
  { id: 'offers', label: 'Ofertas' },
  { id: 'users', label: 'Usuários' },
]

export const AdminSidebar = ({ active, onChange }: AdminSidebarProps) => (
  <aside className="w-full rounded-3xl border border-[#ddb1cf] bg-[#f1e6f3] p-3 sm:p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_8px_18px_rgba(87,52,73,0.08)] md:sticky md:top-20 md:w-56">
    <nav className="grid grid-cols-2 gap-2 sm:grid-cols-5 md:flex md:flex-col md:gap-3">
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => onChange(section.id)}
          className={cn(
            'w-full rounded-2xl px-3 py-2 text-center text-sm font-semibold transition sm:px-4 sm:py-3 md:text-left',
            'md:block md:w-full',
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
