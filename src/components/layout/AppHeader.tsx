import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'

export const AppHeader = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-rose-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-xl font-bold tracking-wide text-rose-900">
          Studio Karine Reverte
        </Link>

        <nav className="hidden items-center gap-5 text-sm text-zinc-700 md:flex">
          <NavLink to="/services">Servicos</NavLink>
          <NavLink to="/booking">Agendar</NavLink>
          <NavLink to="/offers">Ofertas</NavLink>
        </nav>

        {isAuthenticated && user ? (
          <div className="relative">
            <Button variant="ghost" onClick={() => setOpen((value) => !value)} className="inline-flex items-center gap-2">
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
            <Link to="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button>Criar conta</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
