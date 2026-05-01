'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PLMunLogo } from '@/components/shared/PLMunLogo'
import { Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { usePasswordStrength } from '@/hooks/usePasswordStrength'
import { StrengthMeter } from '@/components/ui/StrengthMeter'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { password: newPassword, setPassword, strength, requirements, isValid } = usePasswordStrength()

  useEffect(() => {
    // Get the token from the URL hash or the query params
    const hashParams = new URLSearchParams(window.location.hash.slice(1))
    const queryParams = new URLSearchParams(window.location.search)
    const accessToken = hashParams.get('access_token') || queryParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token')

    if (accessToken) {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || '',
      }).then(({ error }) => {
        if (error) {
          setError('This reset link has expired or is invalid. Please request a new one.')
        }
        setIsLoading(false)
      })
    } else {
      setError('Invalid reset link. Please request a new one.')
      setIsLoading(false)
    }
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        setError(updateError.message)
      } else {
        setSuccess(true)
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-md text-center py-20">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: '#6B0000' }} />
        <p style={{ color: '#5A5A56' }}>Verifying reset link...</p>
      </div>
    )
  }

  if (error && !success) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center p-4"
        style={{ backgroundColor: '#FAFAF7' }}
      >
        <div className="w-full max-w-md text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#FEF2F2' }}
          >
            <AlertCircle className="h-8 w-8" style={{ color: '#9B1C1C' }} />
          </div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: '#6B0000', fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Invalid Link
          </h1>
          <p className="mb-6" style={{ color: '#5A5A56' }}>
            {error}
          </p>
          <Link
            href="/forgot-password"
            className="inline-block px-6 py-3 text-white font-medium rounded-lg hover-lift"
            style={{ backgroundColor: '#6B0000' }}
          >
            Request New Link
          </Link>
          <div className="mt-4">
            <Link
              href="/login"
              className="text-sm hover-lift"
              style={{ color: '#5A5A56' }}
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (success) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center p-4"
        style={{ backgroundColor: '#FAFAF7' }}
      >
        <div className="w-full max-w-md text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: '#EDF7F0' }}
          >
            <CheckCircle className="h-10 w-10" style={{ color: '#1A6B3C' }} />
          </div>
          <h1
            className="text-3xl font-bold mb-3"
            style={{ color: '#6B0000', fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Password Updated!
          </h1>
          <p className="mb-8" style={{ color: '#5A5A56' }}>
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 text-white font-medium rounded-lg hover-lift"
            style={{ backgroundColor: '#6B0000' }}
          >
            Sign In Now
          </Link>
          <div className="mt-6">
            <Link
              href="/"
              className="text-sm hover-lift"
              style={{ color: '#5A5A56' }}
            >
              ← Back to Bulletin
            </Link>
          </div>
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
        <div className="flex flex-col items-center mb-8">
          <Link href="/"><PLMunLogo size="xl" className="mb-4 hover-lift" /></Link>
          <h1
            className="text-2xl font-bold"
            style={{ color: '#6B0000', fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Set New Password
          </h1>
          <p className="text-sm mt-1" style={{ color: '#5A5A56' }}>
            Enter your new password below
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
            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
                style={{ color: '#5A5A56' }}
              >
                New Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
                  style={{ color: '#9A9A95' }}
                />
                <input
                  id="password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-base"
                  style={{
                    border: '1px solid #D4D4CF',
                    outline: 'none',
                  }}
                  required
                />
              </div>
              <StrengthMeter
                password={newPassword}
                strength={strength}
                requirements={requirements}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                className="p-3 rounded-lg text-sm"
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#9B1C1C',
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSaving || !isValid}
              className="w-full py-3 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors hover-lift"
              style={{
                backgroundColor: isSaving ? '#8B1010' : '#6B0000',
                opacity: (isSaving || !isValid) ? 0.5 : 1,
              }}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAF7' }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#6B0000' }} />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}