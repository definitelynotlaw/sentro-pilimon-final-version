'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Loader2 } from 'lucide-react'

export default function ConfirmedPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isVerifying, setIsVerifying] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const verifyAndRedirect = async () => {
      try {
        const { data: { user }, error: sessionError } = await supabase.auth.getUser()

        if (sessionError || !user) {
          setError('Invalid or expired confirmation link.')
          setIsVerifying(false)
          return
        }

        await supabase.auth.updateUser({
          data: { email_confirmed: true, confirmed_at: new Date().toISOString() }
        })

        // Sign them out — they must log in manually
        await supabase.auth.signOut()

        setTimeout(() => {
          router.push('/login')
        }, 2000)
        setIsVerifying(false)
      } catch {
        setError('Something went wrong during verification.')
        setIsVerifying(false)
      }
    }

    verifyAndRedirect()
  }, [supabase, router])

  if (isVerifying) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#FAFAF7' }}>
        <div className="w-full max-w-md text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: '#6B0000' }} />
          <p style={{ color: '#5A5A56' }}>Verifying your account...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#FAFAF7' }}>
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FEF2F2' }}>
            <svg className="w-8 h-8" style={{ color: '#9B1C1C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#6B0000', fontFamily: "'Playfair Display', Georgia, serif" }}>
            Confirmation Failed
          </h1>
          <p className="mb-6" style={{ color: '#5A5A56' }}>{error}</p>
          <a href="/register" className="inline-block px-6 py-3 text-white font-medium rounded-lg hover-lift" style={{ backgroundColor: '#6B0000' }}>
            Try Register Again
          </a>
          <div className="mt-4">
            <a href="/login" className="text-sm hover-lift" style={{ color: '#5A5A56' }}>← Back to Sign In</a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#FAFAF7' }}>
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#EDF7F0' }}>
          <CheckCircle className="h-10 w-10" style={{ color: '#1A6B3C' }} />
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{ color: '#6B0000', fontFamily: "'Playfair Display', Georgia, serif" }}>
          Account Confirmed!
        </h1>
        <p className="mb-4" style={{ color: '#5A5A56' }}>
          Your account is ready. Redirecting you to sign in...
        </p>
        <p className="text-sm" style={{ color: '#9A9A95' }}>
          <a href="/login" className="hover-lift" style={{ color: '#C9972C' }}>
            Click here if not redirected →
          </a>
        </p>
      </div>
    </main>
  )
}
EOFcat > sentro-pilimon/app/auth/confirmed/page.tsx << 'EOF'
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Loader2 } from 'lucide-react'

export default function ConfirmedPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isVerifying, setIsVerifying] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const verifyAndRedirect = async () => {
      try {
        const { data: { user }, error: sessionError } = await supabase.auth.getUser()

        if (sessionError || !user) {
          setError('Invalid or expired confirmation link.')
          setIsVerifying(false)
          return
        }

        await supabase.auth.updateUser({
          data: { email_confirmed: true, confirmed_at: new Date().toISOString() }
        })

        // Sign them out — they must log in manually
        await supabase.auth.signOut()

        setTimeout(() => {
          router.push('/login')
        }, 2000)
        setIsVerifying(false)
      } catch {
        setError('Something went wrong during verification.')
        setIsVerifying(false)
      }
    }

    verifyAndRedirect()
  }, [supabase, router])

  if (isVerifying) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#FAFAF7' }}>
        <div className="w-full max-w-md text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: '#6B0000' }} />
          <p style={{ color: '#5A5A56' }}>Verifying your account...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#FAFAF7' }}>
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FEF2F2' }}>
            <svg className="w-8 h-8" style={{ color: '#9B1C1C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#6B0000', fontFamily: "'Playfair Display', Georgia, serif" }}>
            Confirmation Failed
          </h1>
          <p className="mb-6" style={{ color: '#5A5A56' }}>{error}</p>
          <a href="/register" className="inline-block px-6 py-3 text-white font-medium rounded-lg hover-lift" style={{ backgroundColor: '#6B0000' }}>
            Try Register Again
          </a>
          <div className="mt-4">
            <a href="/login" className="text-sm hover-lift" style={{ color: '#5A5A56' }}>← Back to Sign In</a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#FAFAF7' }}>
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#EDF7F0' }}>
          <CheckCircle className="h-10 w-10" style={{ color: '#1A6B3C' }} />
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{ color: '#6B0000', fontFamily: "'Playfair Display', Georgia, serif" }}>
          Account Confirmed!
        </h1>
        <p className="mb-4" style={{ color: '#5A5A56' }}>
          Your account is ready. Redirecting you to sign in...
        </p>
        <p className="text-sm" style={{ color: '#9A9A95' }}>
          <a href="/login" className="hover-lift" style={{ color: '#C9972C' }}>
            Click here if not redirected →
          </a>
        </p>
      </div>
    </main>
  )
}
