export interface ThemeConfig {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  textPrimary: string;
  textSecondary: string;
  bgLight: string;
  border: string;
  sidebarBg: string;
  sidebarText: string;
  chartBar1: string;
  chartBar2: string;
  buttonPrimary: string;
  buttonSecondary: string;
}

export const defaultTheme: ThemeConfig = {
  primary: '#3b82f6',
  secondary: '#1e40af',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  textPrimary: '#0f172a',
  textSecondary: '#64748b',
  bgLight: '#fafbfc',
  border: '#e2e8f0',
  sidebarBg: '#0f172a',
  sidebarText: '#f1f5f9',
  chartBar1: '#3b82f6',
  chartBar2: '#22c55e',
  buttonPrimary: '#667eea',
  buttonSecondary: '#764ba2',
};

export const getThemeConfig = (): ThemeConfig => {
  const stored = localStorage.getItem('themeConfig');
  return stored ? JSON.parse(stored) : defaultTheme;
};

export const setThemeConfig = (config: Partial<ThemeConfig>): void => {
  const current = getThemeConfig();
  const updated = { ...current, ...config };
  localStorage.setItem('themeConfig', JSON.stringify(updated));
  applyThemeToDOM(updated);
};

export const applyThemeToDOM = (theme: ThemeConfig): void => {
  const root = document.documentElement;
  root.style.setProperty('--primary-color', theme.primary);
  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-secondary', theme.secondary);
  root.style.setProperty('--text-primary', theme.textPrimary);
  root.style.setProperty('--text-secondary', theme.textSecondary);
  root.style.setProperty('--bg-light', theme.bgLight);
  root.style.setProperty('--border-color', theme.border);
  root.style.setProperty('--success-color', theme.success);
  root.style.setProperty('--warning-color', theme.warning);
  root.style.setProperty('--danger-color', theme.danger);
  root.style.setProperty('--chart-bar-1', theme.chartBar1);
  root.style.setProperty('--chart-bar-2', theme.chartBar2);
  root.style.setProperty('--button-primary', theme.buttonPrimary);
  root.style.setProperty('--button-secondary', theme.buttonSecondary);
};

export const initTheme = (): void => {
  const theme = getThemeConfig();
  applyThemeToDOM(theme);
};
