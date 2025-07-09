interface ThemeSettings {
  theme: 'light' | 'dark' | 'auto'
  primaryColor: string
  logoColor: string
  fontSize: 'small' | 'medium' | 'large'
  font: string
  containerWidth: 'narrow' | 'normal' | 'wide'
  cardSpacing: number
  borderRadius: 'none' | 'small' | 'medium' | 'large'
  language: string
  dateFormat: string
  animations: boolean
  transitionSpeed: 'slow' | 'normal' | 'fast'
}

export const useTheme = () => {
  // Estado reactivo para las configuraciones
  const settings = ref<ThemeSettings>({
    theme: 'dark', // Dark por defecto
    primaryColor: '#9333EA',
    logoColor: '#9575CD', // Purple por defecto para dark mode
    fontSize: 'medium',
    font: 'poppins',
    containerWidth: 'normal',
    cardSpacing: 6,
    borderRadius: 'medium',
    language: 'es',
    dateFormat: 'dd/mm/yyyy',
    animations: true,
    transitionSpeed: 'normal'
  })

  // Aplicar tema
  const applyTheme = (theme: 'light' | 'dark' | 'auto') => {
    if (process.client) {
      if (theme === 'light') {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      } else if (theme === 'dark') {
        document.documentElement.classList.remove('light')
        document.documentElement.classList.add('dark')
      } else {
        // Auto mode - detectar preferencia del sistema
        document.documentElement.classList.remove('light', 'dark')
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
          document.documentElement.classList.add('light')
        }
      }
    }
  }

  // Aplicar color primario
  const applyPrimaryColor = (color: string) => {
    if (process.client) {
      const hsl = hexToHsl(color)
      document.documentElement.style.setProperty('--primary', `${hsl.h} ${hsl.s}% ${hsl.l}%`)
    }
  }

  // Aplicar color del logo
  const applyLogoColor = (color: string) => {
    if (process.client) {
      document.documentElement.style.setProperty('--button-primary', color)
    }
  }

  // Función auxiliar para convertir HEX a HSL
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2

    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }

  // Cargar configuración
  const loadSettings = () => {
    if (process.client) {
      const saved = localStorage.getItem('palomoSettings')
      if (saved) {
        try {
          const parsedSettings = JSON.parse(saved)
          Object.assign(settings.value, parsedSettings)
        } catch (error) {
          console.error('Error loading settings:', error)
        }
      }
      
      // Aplicar configuraciones
      applyTheme(settings.value.theme)
      applyPrimaryColor(settings.value.primaryColor)
      applyLogoColor(settings.value.logoColor)
    }
  }

  // Guardar configuración
  const saveSettings = () => {
    if (process.client) {
      localStorage.setItem('palomoSettings', JSON.stringify(settings.value))
    }
  }

  // Actualizar configuración
  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    Object.assign(settings.value, newSettings)
    
    if (newSettings.theme) {
      applyTheme(newSettings.theme)
    }
    if (newSettings.primaryColor) {
      applyPrimaryColor(newSettings.primaryColor)
    }
    if (newSettings.logoColor) {
      applyLogoColor(newSettings.logoColor)
    }
    
    saveSettings()
  }

  // Inicializar configuración por defecto en dark mode
  const initializeTheme = () => {
    if (process.client) {
      // Si no hay configuración guardada, aplicar dark mode por defecto
      const saved = localStorage.getItem('palomoSettings')
      if (!saved) {
        document.documentElement.classList.remove('light')
        // Dark es el por defecto, no necesita clase adicional
        // Aplicar colores por defecto
        applyLogoColor(settings.value.logoColor)
        applyPrimaryColor(settings.value.primaryColor)
      }
      loadSettings()
    }
  }

  return {
    settings: readonly(settings),
    loadSettings,
    saveSettings,
    updateSettings,
    initializeTheme,
    applyTheme,
    applyPrimaryColor,
    applyLogoColor
  }
}
