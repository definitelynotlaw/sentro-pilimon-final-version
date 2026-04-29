'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PLMunLogo } from '@/components/shared/PLMunLogo'
import { Mail, Lock, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [surname, setSurname] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const fullName = [firstName, middleName, surname].filter(Boolean).join(' ').trim()

  const passwordsMatch = password === confirmPassword || confirmPassword === ''
  const canSubmit = password.length >= 6 && passwordsMatch

  // Redirect if already logged in (additional client-side check alongside middleware)
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

    // Validate PLMun email
    if (!email.endsWith('@plmun.edu.ph')) {
      setError('Only @plmun.edu.ph accounts are allowed to register')
      setIsLoading(false)
      return
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      // Sign up with Supabase - they handle email confirmation automatically
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'student',
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/auth/confirmed`,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setIsLoading(false)
        return
      }

      // Supabase will send the confirmation email automatically
      setSuccess(true)
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
            style={{ backgroundColor: '#1A6B3C' }}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: '#6B0000', fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Check your email!
          </h1>
          <p className="mb-6" style={{ color: '#5A5A56' }}>
            We sent a confirmation link to <strong>{email}</strong>.
            Click the link to activate your account.
          </p>
          <Link
            href="/login"
            className="text-sm font-medium hover-lift"
            style={{ color: '#C9972C' }}
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
            Join Sentro Pilimon
          </h1>
          <p className="text-sm mt-1" style={{ color: '#5A5A56' }}>
            Register with your PLMun email
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
            {/* Name Fields */}
            <div className="grid grid-cols-3 gap-3">
              {/* Surname */}
              <div>
                <label
                  htmlFor="surname"
                  className="block text-sm font-medium mb-1"
                  style={{ color: '#5A5A56' }}
                >
                  Surname
                </label>
                <input
                  id="surname"
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Dela Cruz"
                  className="w-full px-3 py-3 rounded-lg text-base"
                  style={{
                    border: '1px solid #D4D4CF',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium mb-1"
                  style={{ color: '#5A5A56' }}
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Juan"
                  className="w-full px-3 py-3 rounded-lg text-base"
                  style={{
                    border: '1px solid #D4D4CF',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              {/* Middle Name */}
              <div>
                <label
                  htmlFor="middleName"
                  className="block text-sm font-medium mb-1"
                  style={{ color: '#5A5A56' }}
                >
                  Middle Name
                </label>
                <input
                  id="middleName"
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-3 py-3 rounded-lg text-base"
                  style={{
                    border: '1px solid #D4D4CF',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

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
              <p className="text-xs mt-1" style={{ color: '#9A9A95' }}>
                Only @plmun.edu.ph accounts are allowed
              </p>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
                style={{ color: '#5A5A56' }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
                  style={{ color: '#9A9A95' }}
                />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-base"
                  style={{
                    border: '1px solid #D4D4CF',
                    outline: 'none',
                  }}
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-1"
                style={{ color: '#5A5A56' }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
                  style={{ color: '#9A9A95' }}
                />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-base"
                  style={{
                    border: confirmPassword && !passwordsMatch ? '1px solid #9B1C1C' : '1px solid #D4D4CF',
                    outline: 'none',
                  }}
                  required
                />
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="text-xs mt-1" style={{ color: '#9B1C1C' }}>
                  Passwords do not match
                </p>
              )}
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
              disabled={isLoading || !canSubmit}
              className="w-full py-3 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors hover-lift"
              style={{
                backgroundColor: isLoading ? '#8B1010' : '#6B0000',
                opacity: (isLoading || !canSubmit) ? 0.5 : 1,
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign In link */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: '#9A9A95' }}>
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium hover-lift"
                style={{ color: '#C9972C' }}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm transition-colors hover-lift"
            style={{ color: '#5A5A56' }}
          >
            ← Back to Bulletin
          </Link>
        </div>
      </div>
    </main>
  )
}