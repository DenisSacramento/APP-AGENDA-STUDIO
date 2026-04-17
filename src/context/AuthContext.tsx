import { useCallback, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { authService } from '../services/auth.service'
import type { User } from '../types/models'
import { AuthContext } from './auth-context'

const STORAGE_KEY = 'studio-karine-auth'

const getInitialSession = (): { user: User | null; token: string | null } => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return { user: null, token: null }
  }

  const parsed = JSON.parse(raw) as { user: User; token: string }
  return { user: parsed.user, token: parsed.token }
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const initialSession = getInitialSession()
  const [user, setUser] = useState<User | null>(initialSession.user)
  const [token, setToken] = useState<string | null>(initialSession.token)

  const persist = useCallback((nextUser: User, nextToken: string) => {
    setUser(nextUser)
    setToken(nextToken)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: nextUser, token: nextToken }))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await authService.login({ email, password })
    persist(result.user, result.token)
  }, [persist])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = await authService.register({ name, email, password })
    persist(result.user, result.token)
  }, [persist])

  const loginAdmin = useCallback(async (email: string, password: string) => {
    const result = await authService.loginAdmin({ email, password })
    persist(result.user, result.token)
  }, [persist])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
    setToken(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      loginAdmin,
      logout,
    }),
    [login, loginAdmin, logout, register, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
