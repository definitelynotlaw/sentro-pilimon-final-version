'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'light' | 'dark' | 'system'
type FontSize = 'small' | 'medium' | 'large'

interface ThemeSettings {
  theme: Theme
  fontSize: FontSize
  highContrast: boolean
  reducedMotion: boolean
}

interface ThemeContextType extends ThemeSettings {
  setTheme: (theme: Theme) => void
  setFontSize: (size: FontSize) => void
  setHighContrast: (enabled: boolean) => void
  setReducedMotion: (enabled: boolean) => void
  isHydrated: boolean
}

const defaultSettings: ThemeSettings = {
  theme: 'system',
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function loadSettings(): ThemeSettings {
  if (typeof window === 'undefined') return defaultSettings
  try {
    const stored = localStorage.getItem('plmun-theme-settings')
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) }
    }
  } catch (e) {
    console.error('Failed to load theme settings:', e)
  }
  return defaultSettings
}

function applyThemeSettings(settings: ThemeSettings) {
  if (typeof document === 'undefined') return

  const effectiveTheme = settings.theme === 'system' ? getSystemTheme() : settings.theme
  document.documentElement.setAttribute('data-theme', effectiveTheme)
  document.documentElement.setAttribute('data-font-size', settings.fontSize)
  document.documentElement.setAttribute('data-high-contrast', String(settings.highContrast))
  document.documentElement.setAttribute('data-reduced-motion', String(settings.reducedMotion))
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const loaded = loadSettings()
    setSettings(loaded)
    applyThemeSettings(loaded)
    setIsHydrated(true)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (settings.theme === 'system') {
        document.documentElement.setAttribute('data-theme', getSystemTheme())
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const setTheme = useCallback((theme: Theme) => {
    setSettings(prev => {
      const newSettings = { ...prev, theme }
      localStorage.setItem('plmun-theme-settings', JSON.stringify(newSettings))
      applyThemeSettings(newSettings)
      return newSettings
    })
  }, [])

  const setFontSize = useCallback((fontSize: FontSize) => {
    setSettings(prev => {
      const newSettings = { ...prev, fontSize }
      localStorage.setItem('plmun-theme-settings', JSON.stringify(newSettings))
      applyThemeSettings(newSettings)
      return newSettings
    })
  }, [])

  const setHighContrast = useCallback((highContrast: boolean) => {
    setSettings(prev => {
      const newSettings = { ...prev, highContrast }
      localStorage.setItem('plmun-theme-settings', JSON.stringify(newSettings))
      applyThemeSettings(newSettings)
      return newSettings
    })
  }, [])

  const setReducedMotion = useCallback((reducedMotion: boolean) => {
    setSettings(prev => {
      const newSettings = { ...prev, reducedMotion }
      localStorage.setItem('plmun-theme-settings', JSON.stringify(newSettings))
      applyThemeSettings(newSettings)
      return newSettings
    })
  }, [])

  const value: ThemeContextType = {
    ...settings,
    setTheme,
    setFontSize,
    setHighContrast,
    setReducedMotion,
    isHydrated,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}