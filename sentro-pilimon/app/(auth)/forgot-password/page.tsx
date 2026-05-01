'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PLMunLogo } from '@/components/shared/PLMunLogo'
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard')
      }
    }
    checkAuth()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail.endsWith('@plmun.edu.ph')) {
      setError('Only @plmun.edu.ph accounts can request a password reset')
      setIsLoading(false)
      return
    }

    try {
      const redirectTo = process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
        : `${window.location.origin}/auth/reset-password`

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo,
      })

      if (resetError) {
        setError(resetError.message)
      } else {
        setSuccess(true)
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center p-4"
        style={{ backgroundColor: '#FAFAF7' }}
      >
        <div className="w-full max-w-md text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#EDF7F0' }}
          >
            <CheckCircle className="h-8 w-8" style={{ color: '#1A6B3C' }} />
          </div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: '#6B0000', fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Check your email!
          </h1>
          <p className="mb-6" style={{ color: '#5A5A56' }}>
            We sent a password reset link to <strong>{email}</strong>.
            Click the link in the email to reset your password.
          </p>
          <p className="text-sm mb-6" style={{ color: '#9A9A95' }}>
            Didn&apos;t receive it? Check your spam folder or{' '}
            <button
              onClick={() => setSuccess(false)}
              className="font-medium"
              style={{ color: '#C9972C' }}
            >
              try again
            </button>
          </p>
          <Link
            href="/login"
            className="text-sm font-medium hover-lift"
            style={{ color: '#6B0000' }}
          >
            ← Back to Sign In
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: '#FAFAF7' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/"><PLMunLogo size="xl" className="mb-4 hover-lift" /></Link>
          <h1
            className="text-2xl font-bold"
            style={{ color: '#6B0000', fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Forgot Password
          </h1>
          <p className="text-sm mt-1" style={{ color: '#5A5A56' }}>
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {/* Form Card */}
        <div
          className="bg-white rounded-2xl p-6 md:p-8"
          style={{
            border: '1px solid #EBEBEA',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1"
                style={{ color: '#5A5A56' }}
              >
                PLMun Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
                  style={{ color: '#9A9A95' }}
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@plmun.edu.ph"
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-base"
                  style={{
                    border: '1px solid #D4D4CF',
                    outline: 'none',
                  }}
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="p-3 rounded-lg text-sm flex items-start gap-2"
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#9B1C1C',
                }}
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors hover-lift"
              style={{
                backgroundColor: isLoading ? '#8B1010' : '#6B0000',
                opacity: isLoading ? 0.5 : 1,
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          {/* Back to Sign In */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm transition-colors hover-lift"
              style={{ color: '#5A5A56' }}
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>

        {/* Help text */}
        <div className="mt-6 text-center">
          <p className="text-xs" style={{ color: '#9A9A95' }}>
            Having trouble? Contact your system administrator.
          </p>
        </div>
      </div>
    </main>
  )
}