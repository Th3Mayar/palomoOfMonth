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
  // Reactive state for settings
  const settings = ref<ThemeSettings>({
    theme: 'dark', // Dark by default
    primaryColor: '#9333EA',
    logoColor: '#9575CD', // Purple by default for dark mode
    fontSize: 'medium',
    font: 'poppins',
    containerWidth: 'normal',
    cardSpacing: 6,
    borderRadius: 'medium',
    language: 'en',
    dateFormat: 'mm/dd/yyyy',
    animations: true,
    transitionSpeed: 'normal'
  })

  // Apply theme
  const applyTheme = (theme: 'light' | 'dark' | 'auto') => {
    if (process.client) {
      if (theme === 'light') {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      } else if (theme === 'dark') {
        document.documentElement.classList.remove('light')
        document.documentElement.classList.add('dark')
      } else {
        // Auto mode - detect system preference
        document.documentElement.classList.remove('light', 'dark')
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
          document.documentElement.classList.add('light')
        }
      }
    }
  }

  // Apply primary color
  const applyPrimaryColor = (color: string) => {
    if (process.client) {
      const hsl = hexToHsl(color)
      document.documentElement.style.setProperty('--primary', `${hsl.h} ${hsl.s}% ${hsl.l}%`)
    }
  }

  // Apply logo color
  const applyLogoColor = (color: string) => {
    if (process.client) {
      document.documentElement.style.setProperty('--button-primary', color)
    }
  }

  // Typography settings: font size and font family
  const applyTypography = (size: ThemeSettings['fontSize'], font: string) => {
    if (!process.client) return
    const mapSize = { small: '14px', medium: '16px', large: '18px' }
    document.documentElement.style.setProperty('--base-font-size', mapSize[size])
    document.documentElement.style.setProperty('--font-family-main', font)
  }

  // Layout settings: container width, spacing, and border radius
  const applyLayout = (
    w: ThemeSettings['containerWidth'],
    spacing: number,
    radius: ThemeSettings['borderRadius']
  ) => {
    if (!process.client) return
    const mapWidth = { narrow: '640px', normal: '768px', wide: '1024px' }
    const mapSpace = { 2: '0.5rem', 4: '1rem', 6: '1.5rem', 8: '2rem' }
    const mapRadius = { none: '0', small: '0.25rem', medium: '0.5rem', large: '1rem' }
    document.documentElement.style.setProperty('--container-max-width', mapWidth[w])
    document.documentElement.style.setProperty('--card-spacing', mapSpace[spacing])
    document.documentElement.style.setProperty('--radius', mapRadius[radius])
  }

  // Localization: set the HTML lang attribute
  const applyLocale = (lang: string) => {
    if (!process.client) return
    document.documentElement.setAttribute('lang', lang)
  }

  // Animation settings: toggle and set duration
  const applyAnimations = (enabled: boolean, speed: ThemeSettings['transitionSpeed']) => {
    if (!process.client) return
    const duration = speed === 'slow' ? '0.6s' : speed === 'fast' ? '0.15s' : '0.3s'
    document.documentElement.style.setProperty('--transition-duration', duration)
    document.documentElement.classList.toggle('no-animations', !enabled)
  }

  // Auxiliary function to convert HEX to HSL
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

  // Load settings
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
      
      // Apply settings
      applyTheme(settings.value.theme)
      applyPrimaryColor(settings.value.primaryColor)
      applyLogoColor(settings.value.logoColor)
      applyTypography(settings.value.fontSize, settings.value.font)
      applyLayout(settings.value.containerWidth, settings.value.cardSpacing, settings.value.borderRadius)
      applyLocale(settings.value.language)
      applyAnimations(settings.value.animations, settings.value.transitionSpeed)
    }
  }

  // Save settings
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
    if (newSettings.fontSize || newSettings.font) {
      applyTypography(newSettings.fontSize, newSettings.font)
    }
    if (newSettings.containerWidth || newSettings.cardSpacing || newSettings.borderRadius) {
      applyLayout(newSettings.containerWidth, newSettings.cardSpacing, newSettings.borderRadius)
    }
    if (newSettings.language) {
      applyLocale(newSettings.language)
    }
    if (newSettings.animations !== undefined || newSettings.transitionSpeed) {
      applyAnimations(newSettings.animations, newSettings.transitionSpeed)
    }
    
    saveSettings()
  }

  // Initialize default configuration in dark mode
  const initializeTheme = () => {
    if (process.client) {
      // If no saved configuration, apply dark mode by default
      const saved = localStorage.getItem('palomoSettings')
      if (!saved) {
        document.documentElement.classList.remove('light')
        // Dark is the default, doesn't need additional class
        // Apply default colors
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
    applyLogoColor,
    applyTypography,
    applyLayout,
    applyLocale,
    applyAnimations
  }
}
