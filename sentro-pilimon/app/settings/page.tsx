'use client'

import { useTheme } from '@/context/ThemeContext'
import { Settings, Sun, Moon, Monitor, Type, Eye, Zap, Globe, Clock } from 'lucide-react'

const commonTimezones = [
  'Asia/Manila',
  'Asia/Tokyo',
  'Asia/Singapore',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Australia/Sydney',
]

export default function SettingsPage() {
  const {
    theme,
    fontSize,
    highContrast,
    reducedMotion,
    setTheme,
    setFontSize,
    setHighContrast,
    setReducedMotion,
    isHydrated,
  } = useTheme()

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1
          className="text-2xl font-bold mb-8"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1A1A18' }}
        >
          Settings
        </h1>

        {/* Appearance Section */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-5 w-5" style={{ color: '#6B0000' }} />
            <h2 className="text-lg font-semibold" style={{ color: '#1A1A18' }}>Appearance</h2>
          </div>
          <div
            className="bg-white rounded-xl divide-y"
            style={{ border: '1px solid #EBEBEA', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
          >
            {/* Theme */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#F5F5F3' }}
                  >
                    <Sun className="h-5 w-5" style={{ color: '#5A5A56' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: '#1A1A18' }}>Theme</p>
                    <p className="text-sm" style={{ color: '#9A9A95' }}>Choose your preferred color scheme</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[
                    { value: 'light', icon: Sun, label: 'Light' },
                    { value: 'dark', icon: Moon, label: 'Dark' },
                    { value: 'system', icon: Monitor, label: 'System' },
                  ].map(({ value, icon: Icon, label }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value as 'light' | 'dark' | 'system')}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                      style={{
                        backgroundColor: theme === value ? '#6B0000' : '#F5F5F3',
                        color: theme === value ? 'white' : '#5A5A56',
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Font Size */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#F5F5F3' }}
                  >
                    <Type className="h-5 w-5" style={{ color: '#5A5A56' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: '#1A1A18' }}>Font Size</p>
                    <p className="text-sm" style={{ color: '#9A9A95' }}>Adjust text size across the app</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[
                    { value: 'small', label: 'S' },
                    { value: 'medium', label: 'M' },
                    { value: 'large', label: 'L' },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setFontSize(value as 'small' | 'medium' | 'large')}
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                      style={{
                        backgroundColor: fontSize === value ? '#6B0000' : '#F5F5F3',
                        color: fontSize === value ? 'white' : '#5A5A56',
                        fontWeight: 600,
                        fontSize: value === 'small' ? '12px' : value === 'large' ? '18px' : '14px',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* High Contrast */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#F5F5F3' }}
                  >
                    <Eye className="h-5 w-5" style={{ color: '#5A5A56' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: '#1A1A18' }}>High Contrast</p>
                    <p className="text-sm" style={{ color: '#9A9A95' }}>Increase color contrast for better visibility</p>
                  </div>
                </div>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className="relative w-12 h-6 rounded-full transition-colors"
                  style={{ backgroundColor: highContrast ? '#6B0000' : '#D4D4CF' }}
                  role="switch"
                  aria-checked={highContrast}
                >
                  <span
                    className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
                    style={{ transform: highContrast ? 'translateX(24px)' : 'translateX(0)' }}
                  />
                </button>
              </div>
            </div>

            {/* Reduced Motion */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#F5F5F3' }}
                  >
                    <Zap className="h-5 w-5" style={{ color: '#5A5A56' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: '#1A1A18' }}>Reduced Motion</p>
                    <p className="text-sm" style={{ color: '#9A9A95' }}>Minimize animations and transitions</p>
                  </div>
                </div>
                <button
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className="relative w-12 h-6 rounded-full transition-colors"
                  style={{ backgroundColor: reducedMotion ? '#6B0000' : '#D4D4CF' }}
                  role="switch"
                  aria-checked={reducedMotion}
                >
                  <span
                    className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform"
                    style={{ transform: reducedMotion ? 'translateX(24px)' : 'translateX(0)' }}
                  />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Regional Section */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-5 w-5" style={{ color: '#6B0000' }} />
            <h2 className="text-lg font-semibold" style={{ color: '#1A1A18' }}>Regional</h2>
          </div>
          <div
            className="bg-white rounded-xl divide-y"
            style={{ border: '1px solid #EBEBEA', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
          >
            {/* Timezone */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#F5F5F3' }}
                >
                  <Clock className="h-5 w-5" style={{ color: '#5A5A56' }} />
                </div>
                <div>
                  <p className="font-medium" style={{ color: '#1A1A18' }}>Timezone</p>
                  <p className="text-sm" style={{ color: '#9A9A95' }}>Set your local timezone for event times</p>
                </div>
              </div>
              <select
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: '#D4D4CF',
                  backgroundColor: 'white',
                  color: '#1A1A18',
                }}
                defaultValue="Asia/Manila"
                onChange={(e) => {
                  localStorage.setItem('plmun-timezone', e.target.value)
                }}
              >
                {commonTimezones.map(tz => (
                  <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            {/* Date Format */}
            <div className="p-6">
              <p className="font-medium mb-3" style={{ color: '#1A1A18' }}>Date Format</p>
              <div className="flex gap-4">
                {[
                  { value: 'MDY', label: 'MM/DD/YYYY', example: '04/29/2026' },
                  { value: 'DMY', label: 'DD/MM/YYYY', example: '29/04/2026' },
                  { value: 'YMD', label: 'YYYY-MM-DD', example: '2026-04-29' },
                ].map(({ value, label, example }) => (
                  <label
                    key={value}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer"
                    style={{
                      border: '1px solid #EBEBEA',
                      backgroundColor: 'white',
                    }}
                  >
                    <input
                      type="radio"
                      name="dateFormat"
                      value={value}
                      defaultChecked={value === 'MDY'}
                      className="sr-only"
                      onChange={(e) => {
                        localStorage.setItem('plmun-date-format', e.target.value)
                      }}
                    />
                    <div>
                      <p className="font-medium" style={{ color: '#1A1A18' }}>{label}</p>
                      <p className="text-xs" style={{ color: '#9A9A95' }}>{example}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility Info */}
        <section className="mb-8">
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: '#FDF6E3', border: '1px solid #C9972C' }}
          >
            <h3 className="font-semibold mb-2" style={{ color: '#1A1A18' }}>Accessibility</h3>
            <p className="text-sm mb-3" style={{ color: '#5A5A56' }}>
              This app supports keyboard navigation. Press <kbd className="px-2 py-1 rounded" style={{ backgroundColor: '#EBEBEA', fontFamily: 'monospace' }}>Tab</kbd> to navigate and <kbd className="px-2 py-1 rounded" style={{ backgroundColor: '#EBEBEA', fontFamily: 'monospace' }}>Enter</kbd> to select.
            </p>
            <p className="text-xs" style={{ color: '#9A9A95' }}>
              For screen reader users, the app uses proper ARIA labels and semantic HTML throughout.
            </p>
          </div>
        </section>

        {/* App Info */}
        <section className="text-center pt-4" style={{ borderTop: '1px solid #EBEBEA' }}>
          <p className="text-sm" style={{ color: '#9A9A95' }}>Sentro Pilimon v1.0</p>
          <p className="text-xs mt-1" style={{ color: '#D4D4CF' }}>Pamantasan ng Lungsod ng Muntinlupa</p>
        </section>
      </div>
    </main>
  )
}