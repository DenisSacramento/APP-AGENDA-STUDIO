import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { CalendarDays, ChevronDown, Gift, Scissors } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'

export const AppHeader = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)
  const navItemClass =
    'inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-base font-semibold text-zinc-700 shadow-[0_5px_12px_rgba(30,30,30,0.08)] transition duration-300 hover:-translate-y-0.5 hover:border-[#cfae4f] hover:bg-[#cfae4f] hover:text-[#2a1a04] hover:shadow-[0_12px_24px_rgba(109,82,24,0.3)]'

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-[#f6f2fb]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="leading-tight">
          <span className="studio-script studio-effect block -rotate-[5deg] text-[31px] leading-none text-[#debf6d]">Studio</span>
          <span className="block -mt-1 text-[17px] font-black tracking-[0.1em] text-[#d10677]">KARINE REVERTE</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink className={navItemClass} to="/services">
            <Scissors size={17} /> Serviços
          </NavLink>
          <NavLink className={navItemClass} to="/booking">
            <CalendarDays size={17} /> Agendar
          </NavLink>
          <NavLink className={navItemClass} to="/offers">
            <Gift size={17} /> Ofertas
          </NavLink>
        </nav>

        {isAuthenticated && user ? (
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex items-center gap-2 border border-zinc-200 bg-white px-4 py-2 font-semibold text-zinc-700 shadow-[0_5px_12px_rgba(30,30,30,0.08)] transition duration-300 hover:-translate-y-0.5 hover:border-[#cfae4f] hover:bg-[#cfae4f] hover:text-[#2a1a04] hover:shadow-[0_12px_24px_rgba(109,82,24,0.3)]"
            >
              {user.name.split(' ')[0]}
              <ChevronDown size={16} />
            </Button>

            {open ? (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-rose-100 bg-white p-2 shadow-lg">
                {user.role === 'client' ? (
                  <>
                    <Link className="block rounded-xl px-3 py-2 text-sm hover:bg-rose-50" to="/profile" onClick={() => setOpen(false)}>
                      Meu perfil
                    </Link>
                    <Link
                      className="block rounded-xl px-3 py-2 text-sm hover:bg-rose-50"
                      to="/my-appointments"
                      onClick={() => setOpen(false)}
                    >
                      Meus agendamentos
                    </Link>
                  </>
                ) : (
                  <Link className="block rounded-xl px-3 py-2 text-sm hover:bg-rose-50" to="/admin/dashboard" onClick={() => setOpen(false)}>
                    Dashboard admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                  className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                >
                  Sair
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden sm:block">
              <Button className="bg-[#940068] px-6 py-2 text-lg font-bold text-white shadow-[0_8px_20px_rgba(148,0,104,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#cfae4f] hover:text-[#2a1a04] hover:shadow-[0_12px_24px_rgba(109,82,24,0.3)]">
                Entrar / Cadastrar
              </Button>
            </Link>
            <Link to="/login" className="sm:hidden">
              <Button className="bg-[#940068] px-4 py-2 text-sm font-bold text-white transition duration-300 hover:bg-[#cfae4f] hover:text-[#2a1a04]">
                Entrar
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
