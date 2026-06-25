import { useEffect } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'

export function useThemeColors() {
  const { settings } = useSettingsStore()

  useEffect(() => {
    // Aplicar colores del sistema como variables CSS
    const root = document.documentElement

    root.style.setProperty('--color-primary', settings.primaryColor)
    root.style.setProperty('--color-secondary', settings.secondaryColor)
    root.style.setProperty('--color-accent', settings.accentColor)

    // Crear variaciones de los colores primarios para sombras y hover
    root.style.setProperty('--color-primary-light', settings.primaryColor + '20')
    root.style.setProperty('--color-primary-dark', settings.primaryColor + 'CC')
  }, [settings.primaryColor, settings.secondaryColor, settings.accentColor])
}
