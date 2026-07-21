import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AdminUser } from '@/types'

interface AuthContextValue {
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string, remember: boolean) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const SESSION_KEY = 'couplo_admin_session'

// TODO(backend): replace with POST /api/admin/auth/login once the Couplo
// backend exposes an admin auth endpoint. Kept here as a single call site
// so wiring the real API later only touches this function.
async function loginRequest(email: string, password: string): Promise<AdminUser> {
  await new Promise((resolve) => setTimeout(resolve, 600))

  if (!email || !password) {
    throw new Error('Email and password are required.')
  }
  if (password.length < 6) {
    throw new Error('Incorrect email or password.')
  }

  return {
    name: 'Admin User',
    email,
    role: 'Premium Access',
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY) ?? localStorage.getItem(SESSION_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        // ignore malformed session
      }
    }
  }, [])

  const login = useCallback(async (email: string, password: string, remember: boolean) => {
    setIsLoading(true)
    setError(null)
    try {
      const loggedInUser = await loginRequest(email, password)
      setUser(loggedInUser)
      const store = remember ? localStorage : sessionStorage
      store.setItem(SESSION_KEY, JSON.stringify(loggedInUser))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in.'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    sessionStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(SESSION_KEY)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user, isLoading, error, login, logout }),
    [user, isLoading, error, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
