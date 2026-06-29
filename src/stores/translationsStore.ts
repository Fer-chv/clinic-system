import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Translations {
  // Login
  loginTitle: string
  loginSubtitle: string
  loginEmailPlaceholder: string
  loginPasswordPlaceholder: string
  loginButton: string
  loginDemoButton: string
  loginDemoEmail: string
  loginDemoPassword: string
  loginDivider: string

  // Header & Layout
  headerTitle: string
  headerVersion: string
  headerLogout: string
  headerProfile: string

  // Dashboard
  dashboardWelcome: string
  dashboardSubtitle: string
  dashboardNewAppointment: string
  dashboardNewPatient: string
  dashboardRevenueToday: string
  dashboardRevenueMonth: string
  dashboardAppointmentsToday: string
  dashboardTotalPatients: string
  dashboardRevenueByDoctor: string
  dashboardRevenueHistory: string
  dashboardTreatmentDistribution: string
  dashboardAppointmentsSummary: string
  dashboardGeneralActivity: string
  dashboardNewPatientsMonth: string
  dashboardPendingAppointments: string
  dashboardAverageIncome: string

  // Modules
  moduleDashboard: string
  modulePatients: string
  moduleDoctors: string
  moduleAppointments: string
  moduleClinical: string
  moduleEvaluation: string
  moduleInventory: string
  moduleInvoices: string
  moduleReports: string
  moduleAdministration: string

  // Common
  save: string
  cancel: string
  delete: string
  edit: string
  add: string
  search: string
  loading: string
  success: string
  error: string
  warning: string
  info: string
}

const DEFAULT_TRANSLATIONS: Translations = {
  // Login
  loginTitle: 'ClinicSystem',
  loginSubtitle: 'Gestión Integral para tu Clínica Odontológica',
  loginEmailPlaceholder: 'su@email.com',
  loginPasswordPlaceholder: 'Su contraseña',
  loginButton: 'Iniciar Sesión',
  loginDemoButton: 'Prueba Demo (Admin)',
  loginDemoEmail: 'admin@clinic.com',
  loginDemoPassword: 'password',
  loginDivider: 'o acceso rápido',

  // Header & Layout
  headerTitle: 'Sistema de Gestión Clínica',
  headerVersion: 'Versión 1.0',
  headerLogout: 'Logout',
  headerProfile: 'Perfil',

  // Dashboard
  dashboardWelcome: '¡Bienvenido',
  dashboardSubtitle: 'Aquí está el resumen de tu clínica odontológica hoy',
  dashboardNewAppointment: '📅 Nueva Cita',
  dashboardNewPatient: '👤 Nuevo Paciente',
  dashboardRevenueToday: 'Ingresos Hoy',
  dashboardRevenueMonth: 'Ingresos Mes',
  dashboardAppointmentsToday: 'Citas Hoy',
  dashboardTotalPatients: 'Total Pacientes',
  dashboardRevenueByDoctor: 'Ingresos por Doctor',
  dashboardRevenueHistory: 'Ingresos (Últimos 7 días)',
  dashboardTreatmentDistribution: 'Distribución de Tratamientos',
  dashboardAppointmentsSummary: 'Resumen de Citas',
  dashboardGeneralActivity: 'Actividad General',
  dashboardNewPatientsMonth: 'Nuevos Pacientes Este Mes',
  dashboardPendingAppointments: 'Citas Pendientes',
  dashboardAverageIncome: 'Promedio Ingreso/Día',

  // Modules
  moduleDashboard: 'Dashboard',
  modulePatients: 'Pacientes',
  moduleDoctors: 'Doctores',
  moduleAppointments: 'Citas',
  moduleClinical: 'Expedientes',
  moduleEvaluation: 'Evaluación Dental',
  moduleInventory: 'Inventario',
  moduleInvoices: 'Facturación',
  moduleReports: 'Reportes',
  moduleAdministration: 'Administración',

  // Common
  save: 'Guardar',
  cancel: 'Cancelar',
  delete: 'Eliminar',
  edit: 'Editar',
  add: 'Agregar',
  search: 'Buscar',
  loading: 'Cargando...',
  success: 'Éxito',
  error: 'Error',
  warning: 'Advertencia',
  info: 'Información',
}

interface TranslationsStore {
  translations: Translations
  updateTranslation: (key: keyof Translations, value: string) => void
  updateMultiple: (updates: Partial<Translations>) => void
  resetToDefaults: () => void
}

export const useTranslationsStore = create<TranslationsStore>()(
  persist(
    (set) => ({
      translations: DEFAULT_TRANSLATIONS,

      updateTranslation: (key: keyof Translations, value: string) => {
        set((state) => ({
          translations: {
            ...state.translations,
            [key]: value,
          },
        }))
      },

      updateMultiple: (updates: Partial<Translations>) => {
        set((state) => ({
          translations: {
            ...state.translations,
            ...updates,
          },
        }))
      },

      resetToDefaults: () => {
        set({ translations: DEFAULT_TRANSLATIONS })
      },
    }),
    {
      name: 'clinic-translations',
    }
  )
)
