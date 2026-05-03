'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Loader2, PartyPopper } from 'lucide-react'

export default function ConfirmedPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isVerifying, setIsVerifying] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [countdown, setCountdown] = useState(3)

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
        await supabase.auth.signOut()
        setIsVerifying(false)
        setShowModal(true)
      } catch {
        setError('Something went wrong during verification.')
        setIsVerifying(false)
      }
    }
    verifyAndRedirect()
  }, [supabase, router])

  useEffect(() => {
    if (!showModal) return
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval)
          router.push('/login')
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [showModal, router])

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
    <>
      {/* Background page */}
      <main className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#FAFAF7' }}>
        <div className="w-full max-w-md text-center">
          <CheckCircle className="h-12 w-12 mx-auto mb-4" style={{ color: '#1A6B3C' }} />
          <h1 className="text-2xl font-bold" style={{ color: '#6B0000', fontFamily: "'Playfair Display', Georgia, serif" }}>
            Account Confirmed!
          </h1>
        </div>
      </main>

      {/* Success Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-8 text-center"
            style={{ backgroundColor: '#FAFAF7', border: '1px solid #EBEBEA', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
          >
            {/* Icon */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: '#EDF7F0' }}
            >
              <PartyPopper className="h-10 w-10" style={{ color: '#1A6B3C' }} />
            </div>

            {/* Title */}
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: '#6B0000', fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Welcome to Sentro Pilimon!
            </h2>

            {/* Message */}
            <p className="text-sm mb-1" style={{ color: '#5A5A56' }}>
              Your PLMun account has been successfully registered and confirmed.
            </p>
            <p className="text-sm mb-6" style={{ color: '#9A9A95' }}>
              You can now sign in to access the campus bulletin.
            </p>

            {/* Countdown bar */}
            <div className="w-full rounded-full h-1.5 mb-4" style={{ backgroundColor: '#EBEBEA' }}>
              <div
                className="h-1.5 rounded-full transition-all duration-1000"
                style={{
                  backgroundColor: '#1A6B3C',
                  width: `${(countdown / 3) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs mb-5" style={{ color: '#9A9A95' }}>
              Redirecting to sign in in {countdown}s...
            </p>

            {/* CTA */}
            <button
              onClick={() => router.push('/login')}
              className="w-full py-3 text-white font-medium rounded-lg hover-lift transition-colors"
              style={{ backgroundColor: '#6B0000' }}
            >
              Go to Sign In →
            </button>
          </div>
        </div>
      )}
    </>
  )
}
