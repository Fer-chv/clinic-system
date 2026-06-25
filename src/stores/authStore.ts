import { create } from 'zustand'
import { User, UserRole } from '@/types'
import authService, { AuthCredentials, AuthResponse } from '@/services/auth'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean

  login: (credentials: AuthCredentials) => Promise<AuthResponse>
  register: (data: any) => Promise<AuthResponse>
  logout: () => void
  setUser: (user: User | null) => void
  setError: (error: string | null) => void
  clearError: () => void
  checkAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: authService.getCurrentUser(),
  token: authService.getCurrentToken(),
  isLoading: false,
  error: null,
  isAuthenticated: authService.isAuthenticated(),

  login: async (credentials: AuthCredentials) => {
    set({ isLoading: true, error: null })

    const response = await authService.login(credentials)

    if (response.success) {
      set({
        user: response.user || null,
        token: response.token || null,
        isAuthenticated: true,
        isLoading: false,
      })
    } else {
      set({
        error: response.error || 'Error desconocido',
        isLoading: false,
      })
    }

    return response
  },

  register: async (data: any) => {
    set({ isLoading: true, error: null })

    const response = await authService.register(data)

    if (response.success) {
      set({
        user: response.user || null,
        token: response.token || null,
        isAuthenticated: true,
        isLoading: false,
      })
    } else {
      set({
        error: response.error || 'Error desconocido',
        isLoading: false,
      })
    }

    return response
  },

  logout: () => {
    authService.logout()
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    })
  },

  setUser: (user: User | null) => {
    set({ user })
  },

  setError: (error: string | null) => {
    set({ error })
  },

  clearError: () => {
    set({ error: null })
  },

  checkAuth: () => {
    const user = authService.getCurrentUser()
    const token = authService.getCurrentToken()
    set({
      user,
      token,
      isAuthenticated: authService.isAuthenticated(),
    })
  },
}))
