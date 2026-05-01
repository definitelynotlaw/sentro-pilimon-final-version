'use client'
import { AuthProvider } from '@/context/AuthContext'
import { AnalyticsProvider } from '@/components/providers/AnalyticsProvider'
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AnalyticsProvider>
        {children}
      </AnalyticsProvider>
    </AuthProvider>
  )
}
