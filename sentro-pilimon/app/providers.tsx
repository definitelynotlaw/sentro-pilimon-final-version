'use client'

import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { AnalyticsProvider } from '@/components/providers/AnalyticsProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}