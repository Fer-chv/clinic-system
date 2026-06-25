import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SystemSettings {
  clinicName: string
  logo: string | null
  primaryColor: string
  secondaryColor: string
  accentColor: string
  modules: ModuleConfig[]
  monthlyRevenueGoal: number
}

export interface ModuleConfig {
  id: string
  name: string
  icon: string
  path: string
  visible: boolean
  order: number
}

const DEFAULT_MODULES: ModuleConfig[] = [
  { id: 'dashboard', name: 'Dashboard', icon: '📊', path: '/dashboard', visible: true, order: 0 },
  { id: 'patients', name: 'Pacientes', icon: '👥', path: '/patients', visible: true, order: 1 },
  { id: 'appointments', name: 'Citas', icon: '📅', path: '/appointments', visible: true, order: 2 },
  { id: 'clinical', name: 'Expedientes', icon: '📋', path: '/clinical', visible: true, order: 3 },
  { id: 'doctors', name: 'Doctores', icon: '👨‍⚕️', path: '/doctors', visible: true, order: 4 },
  { id: 'inventory', name: 'Inventario', icon: '📦', path: '/inventory', visible: true, order: 5 },
  { id: 'invoices', name: 'Facturación', icon: '🧾', path: '/invoices', visible: true, order: 6 },
  { id: 'earnings', name: 'Ganancias', icon: '💰', path: '/earnings', visible: true, order: 7 },
  { id: 'reports', name: 'Reportes', icon: '📈', path: '/reports', visible: true, order: 8 },
]

const DEFAULT_SETTINGS: SystemSettings = {
  clinicName: 'ClinicSystem',
  logo: null,
  primaryColor: '#667eea',
  secondaryColor: '#764ba2',
  accentColor: '#10b981',
  modules: DEFAULT_MODULES,
  monthlyRevenueGoal: 50000,
}

interface SettingsStore {
  settings: SystemSettings
  updateClinicName: (name: string) => void
  updateLogo: (logo: string | null) => void
  updateColors: (primary: string, secondary: string, accent: string) => void
  updateModuleOrder: (modules: ModuleConfig[]) => void
  toggleModuleVisibility: (moduleId: string) => void
  updateMonthlyRevenueGoal: (goal: number) => void
  resetToDefaults: () => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,

      updateClinicName: (name: string) => {
        set((state) => ({
          settings: {
            ...state.settings,
            clinicName: name,
          },
        }))
      },

      updateLogo: (logo: string | null) => {
        set((state) => ({
          settings: {
            ...state.settings,
            logo,
          },
        }))
      },

      updateColors: (primary: string, secondary: string, accent: string) => {
        set((state) => ({
          settings: {
            ...state.settings,
            primaryColor: primary,
            secondaryColor: secondary,
            accentColor: accent,
          },
        }))
        // Actualizar variables CSS globales
        document.documentElement.style.setProperty('--color-primary', primary)
        document.documentElement.style.setProperty('--color-secondary', secondary)
        document.documentElement.style.setProperty('--color-accent', accent)
      },

      updateModuleOrder: (modules: ModuleConfig[]) => {
        set((state) => ({
          settings: {
            ...state.settings,
            modules: modules.sort((a, b) => a.order - b.order),
          },
        }))
      },

      toggleModuleVisibility: (moduleId: string) => {
        set((state) => ({
          settings: {
            ...state.settings,
            modules: state.settings.modules.map((m) =>
              m.id === moduleId ? { ...m, visible: !m.visible } : m
            ),
          },
        }))
      },

      updateMonthlyRevenueGoal: (goal: number) => {
        set((state) => ({
          settings: {
            ...state.settings,
            monthlyRevenueGoal: goal,
          },
        }))
      },

      resetToDefaults: () => {
        set({ settings: DEFAULT_SETTINGS })
      },
    }),
    {
      name: 'clinic-settings-v3',
      version: 3,
    }
  )
)
