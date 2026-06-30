# OPCIONES DE MEJORA VISUAL GLOBAL - IMPLEMENTACIÓN DETALLADA

---

## OPCIÓN A: TEMA MODERNO MINIMALISTA

### Descripción
Diseño ultraclean inspirado en interfaces modernas (Vercel, Linear, Cal.com). Enfoque en legibilidad y espacios en blanco.

### Paleta de Colores Completa

```css
/* Colores Primarios */
:root {
  --primary-50: #F0F4FF
  --primary-100: #E0E7FF
  --primary-200: #C7D2FE
  --primary-300: #A5B4FC
  --primary-400: #818CF8
  --primary-500: #6366F1 /* PRIMARY */
  --primary-600: #4F46E5 /* PRIMARY DARK */
  --primary-700: #4338CA
  --primary-800: #3730A3
  --primary-900: #312E81

  /* Neutrals */
  --white: #FFFFFF
  --gray-50: #F9FAFB
  --gray-100: #F3F4F6
  --gray-200: #E5E7EB
  --gray-300: #D1D5DB
  --gray-400: #9CA3AF
  --gray-500: #6B7280
  --gray-600: #4B5563
  --gray-700: #374151
  --gray-800: #1F2937
  --gray-900: #111827

  /* Estados */
  --success-500: #10B981
  --warning-500: #F59E0B
  --danger-500: #EF4444
  --info-500: #3B82F6

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
}
```

### Cambios en Componentes

#### 1. Body y Background
```css
/* ANTES */
body {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  color: var(--text-primary);
}

/* DESPUÉS */
body {
  background: #FFFFFF; /* Blanco puro */
  color: var(--gray-900);
}
```

#### 2. Cards
```css
/* ANTES */
.ant-card {
  border: none !important;
  box-shadow: var(--shadow-md) !important;
  border-radius: 12px !important;
  background: var(--bg-lighter) !important;
}

/* DESPUÉS */
.ant-card {
  border: 1px solid var(--gray-200) !important;
  box-shadow: none !important;
  border-radius: 8px !important;
  background: var(--white) !important;
}

.ant-card:hover {
  box-shadow: var(--shadow-sm) !important;
  border-color: var(--gray-300) !important;
  transform: none !important; /* Remover transform */
}
```

#### 3. Botones
```css
/* ANTES */
.ant-button-primary {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* DESPUÉS */
.ant-button-primary {
  background: var(--primary-600); /* Color sólido */
  border: none;
  box-shadow: none;
  font-weight: 600;
}

.ant-button-primary:hover {
  background: var(--primary-700);
  box-shadow: none;
  transform: none;
}

.ant-button-primary:active {
  background: var(--primary-800);
}
```

#### 4. Inputs
```css
/* ANTES */
.ant-input {
  border-radius: 10px !important;
  border: 2px solid #e8eaf0 !important;
  background: #f8f9fc !important;
  padding: 12px 16px !important;
  height: 42px !important;
  font-size: 14px !important;
}

/* DESPUÉS */
.ant-input {
  border-radius: 6px !important;
  border: 1px solid var(--gray-300) !important;
  background: var(--white) !important;
  padding: 10px 12px !important;
  height: 40px !important;
  font-size: 14px !important;
  font-weight: 400 !important; /* Remover font-weight 500 */
}

.ant-input:hover {
  border-color: var(--gray-400) !important;
  box-shadow: none !important;
}

.ant-input:focus {
  border-color: var(--primary-500) !important;
  box-shadow: 0 0 0 3px var(--primary-50) !important;
  outline: none !important;
}
```

#### 5. Sidebar
```css
/* ANTES */
.desktop-sider {
  background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%) !important;
}

/* DESPUÉS */
.desktop-sider {
  background: var(--white) !important;
  border-right: 1px solid var(--gray-200);
  box-shadow: none;
}

.desktop-sider .ant-menu-item {
  color: var(--gray-700) !important;
  border-radius: 6px !important;
}

.desktop-sider .ant-menu-item:hover {
  background: var(--gray-100) !important;
  color: var(--primary-600) !important;
  transform: none;
}

.desktop-sider .ant-menu-item-selected {
  background: var(--primary-50) !important;
  color: var(--primary-600) !important;
  border-left: 3px solid var(--primary-600) !important;
}
```

#### 6. Tabla
```css
.ant-table-thead > tr > th {
  background: var(--gray-50) !important;
  font-weight: 600 !important;
  color: var(--gray-700) !important;
  border-bottom: 1px solid var(--gray-200) !important;
  padding: 12px !important;
}

.ant-table-tbody > tr {
  transition: none !important;
}

.ant-table-tbody > tr:hover > td {
  background: var(--gray-50) !important;
}

.ant-table-tbody > tr > td {
  border-bottom: 1px solid var(--gray-100) !important;
  padding: 12px !important;
}
```

### Ventajas de la Opción A
✓ **Rendimiento:** Sin gradientes pesadas, mejor rendimiento
✓ **Legibilidad:** Máximo contraste, fácil de leer
✓ **Accesibilidad:** Cumple WCAG AAA
✓ **Moderno:** Similar a productos SaaS líderes
✓ **Responsive:** Menos líneas CSS, más fácil mantener
✓ **Profesional:** Aspecto corporativo

### Desventajas
✗ Puede parecer muy "plano"
✗ Menos visualmente atractivo que opciones más coloridas
✗ Requiere buena iconografía para compensar

---

## OPCIÓN B: TEMA OSCURO VIBRANTE

### Descripción
Interfaz moderna oscura con acentos en cyan y magenta. Inspirado en Figma Dark Mode, Discord, y Vercel Dark.

### Paleta de Colores

```css
:root {
  /* Background - Navy Oscuro */
  --bg-primary: #0F172A
  --bg-secondary: #1E293B
  --bg-tertiary: #334155
  
  /* Primarios - Vibrantes */
  --primary-400: #06D6FF /* Cyan claro */
  --primary-500: #00D9FF /* Cyan puro */
  --primary-600: #00A8CC /* Cyan oscuro */
  
  /* Secundarios - Vibrant Magenta */
  --secondary-400: #FF006E /* Pink vibrante */
  --secondary-500: #EC4899 /* Magenta */
  --secondary-600: #BE185D /* Magenta oscuro */
  
  /* Neutrals */
  --white: #FFFFFF
  --gray-50: #F8FAFC
  --gray-100: #F1F5F9
  --gray-200: #E2E8F0
  --gray-300: #CBD5E1
  --gray-400: #94A3B8
  --gray-500: #64748B
  --gray-600: #475569
  --gray-700: #334155
  --gray-800: #1E293B
  --gray-900: #0F172A
  
  /* Accents */
  --success: #10B981
  --warning: #F59E0B
  --danger: #EF4444
  --info: #06D6FF
  
  /* Shadows - más dramáticas */
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.3)
  --shadow-md: 0 4px 12px 0 rgba(0, 0, 0, 0.4)
  --shadow-lg: 0 10px 24px 0 rgba(0, 0, 0, 0.5)
  --shadow-xl: 0 20px 40px 0 rgba(0, 0, 0, 0.6)
  
  /* Glow */
  --glow-primary: 0 0 20px rgba(0, 217, 255, 0.3)
  --glow-secondary: 0 0 20px rgba(236, 72, 153, 0.3)
}

/* Dark Mode Default */
html {
  color-scheme: dark;
}
```

### Cambios en Componentes

#### 1. Body
```css
body {
  background: var(--bg-primary);
  color: var(--gray-100);
}
```

#### 2. Cards - Con Glow Sutil
```css
.ant-card {
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
  border-radius: 12px !important;
  background: var(--bg-secondary) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.ant-card:hover {
  box-shadow: 
    0 12px 32px rgba(0, 0, 0, 0.5),
    var(--glow-primary) !important;
  border-color: rgba(0, 217, 255, 0.3) !important;
  transform: translateY(-2px) !important;
}
```

#### 3. Botones - Con Glow
```css
.ant-button-primary {
  background: var(--primary-500);
  border: none;
  box-shadow: var(--glow-primary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  height: 44px;
}

.ant-button-primary:hover {
  background: var(--primary-400);
  box-shadow: 
    0 0 24px var(--glow-primary),
    0 8px 24px rgba(0, 217, 255, 0.2);
  transform: translateY(-2px);
}

.ant-button-secondary {
  background: transparent;
  border: 1px solid var(--secondary-500);
  color: var(--secondary-400);
}

.ant-button-secondary:hover {
  background: rgba(236, 72, 153, 0.1);
  border-color: var(--secondary-400);
  box-shadow: var(--glow-secondary);
}
```

#### 4. Inputs - Con Border Glow
```css
.ant-input {
  border-radius: 8px !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  background: rgba(255, 255, 255, 0.02) !important;
  padding: 10px 12px !important;
  height: 44px !important;
  color: var(--gray-100) !important;
  font-size: 14px !important;
}

.ant-input::placeholder {
  color: var(--gray-500) !important;
}

.ant-input:hover {
  border-color: rgba(0, 217, 255, 0.3) !important;
  background: rgba(255, 255, 255, 0.04) !important;
  box-shadow: 0 0 12px rgba(0, 217, 255, 0.1) !important;
}

.ant-input:focus {
  border-color: var(--primary-500) !important;
  background: rgba(255, 255, 255, 0.05) !important;
  box-shadow: 
    0 0 0 3px rgba(0, 217, 255, 0.1),
    var(--glow-primary) !important;
  outline: none !important;
}
```

#### 5. Sidebar - Gradiente Oscuro
```css
.desktop-sider {
  background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.4);
}

.desktop-sider .ant-menu-item {
  color: var(--gray-300) !important;
  border-radius: 8px !important;
  transition: all 0.3s;
}

.desktop-sider .ant-menu-item:hover {
  background: rgba(0, 217, 255, 0.1) !important;
  color: var(--primary-400) !important;
  transform: translateX(4px);
}

.desktop-sider .ant-menu-item-selected {
  background: rgba(0, 217, 255, 0.15) !important;
  color: var(--primary-400) !important;
  border-left: 3px solid var(--primary-500) !important;
  box-shadow: inset 0 0 12px rgba(0, 217, 255, 0.05);
}
```

#### 6. Tabla
```css
.ant-table {
  background: var(--bg-secondary) !important;
  border-radius: 8px !important;
  overflow: hidden;
}

.ant-table-thead > tr > th {
  background: rgba(0, 217, 255, 0.05) !important;
  color: var(--primary-400) !important;
  font-weight: 700 !important;
  border-bottom: 1px solid rgba(0, 217, 255, 0.1) !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 12px !important;
}

.ant-table-tbody > tr:hover > td {
  background: rgba(0, 217, 255, 0.05) !important;
}

.ant-table-tbody > tr > td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  color: var(--gray-200) !important;
}
```

#### 7. Tags y Badges - Vibración de Color
```css
.ant-tag {
  border-radius: 6px !important;
  padding: 4px 12px !important;
  font-weight: 600 !important;
  border: none !important;
}

.ant-tag-blue {
  background: rgba(0, 217, 255, 0.15) !important;
  color: var(--primary-400) !important;
}

.ant-tag-green {
  background: rgba(16, 185, 129, 0.15) !important;
  color: #10B981 !important;
}

.ant-tag-red {
  background: rgba(239, 68, 68, 0.15) !important;
  color: #EF4444 !important;
}

.ant-tag-orange {
  background: rgba(245, 158, 11, 0.15) !important;
  color: #F59E0B !important;
}

.ant-tag-magenta {
  background: rgba(236, 72, 153, 0.15) !important;
  color: var(--secondary-400) !important;
}
```

### Animaciones Personalizadas

```css
@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 
      0 0 12px rgba(0, 217, 255, 0.3),
      0 0 24px rgba(0, 217, 255, 0.15);
  }
  50% {
    box-shadow: 
      0 0 20px rgba(0, 217, 255, 0.5),
      0 0 40px rgba(0, 217, 255, 0.25);
  }
}

.ant-button-primary:active {
  animation: glow-pulse 0.3s ease-out;
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.loading-card {
  background: linear-gradient(
    90deg,
    rgba(0, 217, 255, 0.05),
    rgba(0, 217, 255, 0.15),
    rgba(0, 217, 255, 0.05)
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

### Ventajas de la Opción B
✓ **Moderna:** Muy visual y atractiva
✓ **Diferenciador:** Único en clínicas odontológicas
✓ **Menos cansancio visual:** Ideal para trabajos prolongados
✓ **Vibrante:** Acentos cyan y magenta son profesionales
✓ **Responsive:** Glow effects ajustan el tamaño
✓ **Futuro-proof:** Tendencia actual en SaaS

### Desventajas
✗ Puede ser excesivo para usuarios conservadores
✗ Requiere testing de accesibilidad (contraste en dark mode)
✗ Más CSS y animaciones = más mantenimiento

---

## OPCIÓN C: TEMA DENTAL PROFESIONAL

### Descripción
Diseño específico para clínicas odontológicas con elementos relacionados a la salud dental. Paleta azul-verde medicalizada.

### Paleta de Colores Específica

```css
:root {
  /* Azul Médico - Confianza, Profesionalismo */
  --dental-primary: #0EA5E9 /* Cyan/Azul */
  --dental-primary-dark: #0369A1
  --dental-primary-light: #E0F2FE
  
  /* Verde Salud - Bienestar */
  --dental-success: #10B981
  --dental-success-dark: #047857
  --dental-success-light: #ECFDF5
  
  /* Naranja Cálido - Calidez profesional */
  --dental-accent: #F97316
  --dental-accent-light: #FFF7ED
  
  /* Backgrounds */
  --bg-light: #FFFFFF
  --bg-gray: #F0F9FF /* Azul muy claro */
  --bg-surface: #F8FAFC
  
  /* Borders y separadores */
  --border-light: #E0F2FE
  --border-primary: #06B6D4
  
  /* Text */
  --text-primary: #0C4A6E
  --text-secondary: #475569
  --text-light: #94A3B8
}
```

### Iconografía Dental

```css
/* Tooth SVG Pattern para backgrounds */
.tooth-pattern {
  background-image: 
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 35px,
      rgba(14, 165, 233, 0.03) 35px,
      rgba(14, 165, 233, 0.03) 70px
    );
}

/* Diente estilizado en headers */
.tooth-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--dental-primary) 0%, var(--dental-success) 100%);
  clip-path: polygon(50% 0%, 100% 38%, 100% 100%, 0% 100%, 0% 38%);
  display: inline-block;
  margin-right: 12px;
}

/* Badge para estados */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-completed::before {
  content: "✓";
  color: var(--dental-success);
  font-weight: 700;
}

.status-pending::before {
  content: "⏱";
  color: var(--dental-accent);
}

.status-cancelled::before {
  content: "✕";
  color: #EF4444;
}
```

### Cambios en Componentes

#### 1. Body
```css
body {
  background: var(--bg-gray); /* Azul muy muy claro */
  color: var(--text-primary);
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
}

/* Patrón sutil de fondo */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}
```

#### 2. Cards con Border Azul
```css
.ant-card {
  border: 1px solid var(--border-light) !important;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.08) !important;
  border-radius: 12px !important;
  background: var(--bg-light) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative !important;
  overflow: hidden !important;
}

/* Línea superior de color */
.ant-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, 
    var(--dental-primary) 0%, 
    var(--dental-success) 50%, 
    var(--dental-accent) 100%
  );
}

.ant-card:hover {
  box-shadow: 0 12px 24px rgba(14, 165, 233, 0.15) !important;
  border-color: var(--border-primary) !important;
  transform: translateY(-4px) !important;
}
```

#### 3. Header con Logo Dental
```css
.ant-layout-header {
  background: linear-gradient(90deg, 
    var(--dental-primary) 0%, 
    var(--dental-success) 100%);
  border-bottom: none;
  box-shadow: 0 4px 16px rgba(14, 165, 233, 0.2);
  padding: 0 24px !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.clinic-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 18px;
  font-weight: 700;
}

.clinic-logo::before {
  content: '';
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

#### 4. Sidebar
```css
.desktop-sider {
  background: linear-gradient(180deg, 
    var(--dental-primary) 0%, 
    var(--dental-primary-dark) 100%) !important;
  border-right: none;
  box-shadow: 2px 0 16px rgba(14, 165, 233, 0.2);
}

.desktop-sider .ant-menu-item {
  color: rgba(255, 255, 255, 0.8) !important;
  border-radius: 8px !important;
  margin: 4px 8px !important;
  transition: all 0.3s;
  position: relative;
  padding-left: 16px !important;
}

.desktop-sider .ant-menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: white;
  border-radius: 0 3px 3px 0;
  transition: height 0.3s;
}

.desktop-sider .ant-menu-item:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  color: white !important;
}

.desktop-sider .ant-menu-item:hover::before {
  height: 20px;
}

.desktop-sider .ant-menu-item-selected {
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
}

.desktop-sider .ant-menu-item-selected::before {
  height: 24px;
}
```

#### 5. Botones
```css
.ant-button-primary {
  background: linear-gradient(135deg, 
    var(--dental-primary) 0%, 
    var(--dental-success) 100%) !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3) !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  height: 44px !important;
}

.ant-button-primary:hover {
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.4) !important;
  transform: translateY(-2px) !important;
}

.ant-button-default {
  border: 1px solid var(--border-light) !important;
  color: var(--text-primary) !important;
  background: var(--bg-light) !important;
}

.ant-button-default:hover {
  border-color: var(--dental-primary) !important;
  color: var(--dental-primary) !important;
  background: var(--dental-primary-light) !important;
}
```

#### 6. Inputs
```css
.ant-input {
  border-radius: 8px !important;
  border: 2px solid var(--border-light) !important;
  padding: 10px 12px !important;
  height: 44px !important;
  color: var(--text-primary) !important;
  background: var(--bg-light) !important;
  transition: all 0.3s !important;
}

.ant-input::placeholder {
  color: var(--text-light) !important;
}

.ant-input:hover {
  border-color: var(--dental-primary) !important;
  box-shadow: 0 0 0 3px var(--dental-primary-light) !important;
}

.ant-input:focus {
  border-color: var(--dental-primary) !important;
  box-shadow: 0 0 0 4px var(--dental-primary-light) !important;
  outline: none !important;
}
```

#### 7. Tabla
```css
.ant-table {
  background: var(--bg-light);
  border-radius: 8px;
  overflow: hidden;
}

.ant-table-thead > tr > th {
  background: linear-gradient(90deg, 
    var(--dental-primary-light) 0%, 
    var(--dental-success-light) 100%);
  color: var(--text-primary);
  font-weight: 700;
  border-bottom: 2px solid var(--border-primary);
  padding: 14px;
}

.ant-table-tbody > tr:hover > td {
  background: var(--dental-primary-light);
  transition: all 0.2s;
}

.ant-table-tbody > tr > td {
  border-bottom: 1px solid #E8F4F8;
  padding: 14px;
  color: var(--text-primary);
}
```

#### 8. Pacientes Card - Específico
```css
.patient-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  background: linear-gradient(135deg, 
    rgba(14, 165, 233, 0.02) 0%, 
    rgba(16, 185, 129, 0.02) 100%);
  transition: all 0.3s;
}

.patient-card:hover {
  border-color: var(--dental-primary);
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.1);
}

.patient-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, 
    var(--dental-primary) 0%, 
    var(--dental-success) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
}

.patient-info h4 {
  margin: 0 0 4px 0;
  color: var(--text-primary);
  font-weight: 700;
}

.patient-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 8px;
}

.patient-status.healthy {
  background: var(--dental-success-light);
  color: var(--dental-success-dark);
}

.patient-status.needs-attention {
  background: var(--dental-accent-light);
  color: var(--dental-accent);
}
```

#### 9. Appointment Card - Específico
```css
.appointment-card {
  border-left: 4px solid var(--dental-primary);
  background: linear-gradient(90deg, 
    rgba(14, 165, 233, 0.04) 0%, 
    transparent 100%);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.3s;
}

.appointment-card:hover {
  box-shadow: 0 6px 16px rgba(14, 165, 233, 0.12);
  transform: translateX(4px);
}

.appointment-time {
  background: var(--dental-primary);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  display: inline-block;
  margin-bottom: 8px;
}

.appointment-patient {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 4px;
}

.appointment-doctor {
  color: var(--text-secondary);
  font-size: 13px;
}
```

### Elementos Específicos Odontología

```css
/* Tooth chart/odontogram */
.tooth-cell {
  border: 1px solid var(--border-light);
  background: linear-gradient(135deg, 
    rgba(14, 165, 233, 0.05) 0%, 
    rgba(16, 185, 129, 0.05) 100%);
  border-radius: 6px;
  padding: 8px;
  text-align: center;
  transition: all 0.3s;
}

.tooth-cell:hover {
  border-color: var(--dental-primary);
  background: var(--dental-primary-light);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
}

.tooth-cell.healthy {
  border-color: var(--dental-success);
  background: var(--dental-success-light);
}

.tooth-cell.needs-treatment {
  border-color: var(--dental-accent);
  background: var(--dental-accent-light);
}

.tooth-cell.treated {
  border-color: var(--dental-primary);
  background: var(--dental-primary-light);
}

/* Treatment badge */
.treatment-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: var(--dental-primary-light);
  color: var(--dental-primary-dark);
}

.treatment-badge.cleaning {
  background: #E0F2FE;
  color: #0369A1;
}

.treatment-badge.filling {
  background: #FEF3C7;
  color: #92400E;
}

.treatment-badge.root-canal {
  background: #FEE2E2;
  color: #991B1B;
}

.treatment-badge.extraction {
  background: #F3E8FF;
  color: #6B21A8;
}
```

### Ventajas de la Opción C
✓ **Específica del dominio:** Elementos dentales reconocibles
✓ **Profesional y médica:** Inspira confianza
✓ **Diferenciador:** Único y memorable
✓ **Colores armoniosos:** Azul-verde es combinación común en medicina
✓ **Accesible:** Buen contraste de colores
✓ **Escalable:** Fácil agregar más elementos dentales

### Desventajas
✗ Requiere diseño de iconografía personalizado
✗ Más CSS específico para cada componente
✗ Puede parecer "muy especializado"

---

## RESUMEN COMPARATIVO

| Aspecto | Opción A (Minimalista) | Opción B (Oscuro) | Opción C (Dental) |
|--------|----------------------|------------------|------------------|
| **Rendimiento** | Excelente | Muy Bueno | Muy Bueno |
| **Accesibilidad** | WCAG AAA | WCAG AA+ | WCAG AA+ |
| **Legibilidad** | Máxima | Alta | Alta |
| **Atractivo Visual** | Moderno | Muy Vibrante | Profesional |
| **Diferenciación** | Media | Alta | Muy Alta |
| **Facilidad Mantenimiento** | Alta | Media | Media |
| **Cantidad CSS** | Menor | Mayor | Mayor |
| **Animaciones** | Mínimas | Muchas | Moderadas |
| **Responsividad** | Excelente | Excelente | Excelente |

---

## RECOMENDACIÓN FINAL

**Para una clínica odontológica profesional: OPCIÓN C**

- Combina profesionalismo con identidad específica del sector
- Inspira confianza en los pacientes
- Es única y memorable
- Facilita futura expansión de marca

**Tiempo de implementación:**
- Opción A: 3-4 días
- Opción B: 5-7 días
- Opción C: 7-10 días

