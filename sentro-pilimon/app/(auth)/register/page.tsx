'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PLMunLogo } from '@/components/shared/PLMunLogo'
import { Mail, Lock, Loader2, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react'

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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const fullName = [firstName, middleName, surname].filter(Boolean).join(' ').trim()
  const isPlmunEmail = email.endsWith('@plmun.edu.ph')
  const hasMinLength = password.length >= 6
  const passwordsMatch = password === confirmPassword
  const canSubmit = isPlmunEmail && hasMinLength && passwordsMatch && firstName && surname && !isLoading

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) router.push('/dashboard')
    }
    checkAuth()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!firstName || !surname) { setError('Please enter your full name'); return }
    if (!email) { setError('Email is required'); return }
    if (!isPlmunEmail) { setError('Only @plmun.edu.ph accounts are allowed'); return }
    if (!hasMinLength) { setError('Password must be at least 6 characters'); return }
    if (!passwordsMatch) { setError('Passwords do not match'); return }

    setIsLoading(true)
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email, password,
        options: {
          data: { full_name: fullName, role: 'student' },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/auth/confirmed`,
        },
      })
      if (signUpError) { setError(signUpError.message); return }
      await supabase.auth.signOut()
      setSuccess(true)
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#FAFAF7' }}>
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#1A6B3C' }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#6B0000', fontFamily: "'Playfair Display', Georgia, serif" }}>
            Check your email!
          </h1>
          <p className="mb-6" style={{ color: '#5A5A56' }}>
            We sent a confirmation link to <strong>{email}</strong>. Click the link to activate your account.
          </p>
          <Link href="/login" className="text-sm font-medium hover-lift" style={{ color: '#C9972C' }}>
            ← Back to Sign In
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#FAFAF7' }}>
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Link href="/"><PLMunLogo size="xl" className="mb-4 hover-lift" /></Link>
          <h1 className="text-2xl font-bold" style={{ color: '#6B0000', fontFamily: "'Playfair Display', Georgia, serif" }}>
            Join Sentro Pilimon
          </h1>
          <p className="text-sm mt-1" style={{ color: '#5A5A56' }}>Register with your PLMun email</p>
        </div>

        {/* Onboarding Instructions */}
        <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: '#FFF8EC', border: '1px solid #F0D9A0' }}>
          <p className="text-sm font-semibold mb-2" style={{ color: '#7B5000' }}>How to create your account:</p>
          <ol className="text-sm space-y-1" style={{ color: '#7B5000' }}>
            <li>1. Fill in your name exactly as it appears in your school records.</li>
            <li>2. Use your official <strong>@plmun.edu.ph</strong> email address.</li>
            <li>3. Create a password with at least 6 characters.</li>
            <li>4. Check your email and click the confirmation link to activate.</li>
          </ol>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8" style={{ border: '1px solid #EBEBEA', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1" style={{ color: '#5A5A56' }}>First Name</label>
                <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Juan" className="w-full px-3 py-3 rounded-lg text-base"
                  style={{ border: '1px solid #D4D4CF', outline: 'none' }} required />
              </div>
              <div>
                <label htmlFor="middleName" className="block text-sm font-medium mb-1" style={{ color: '#5A5A56' }}>Middle Name <span style={{ color: '#9A9A95' }}>(Optional)</span></label>
                <input id="middleName" type="text" value={middleName} onChange={(e) => setMiddleName(e.target.value)}
                  placeholder="Santos" className="w-full px-3 py-3 rounded-lg text-base"
                  style={{ border: '1px solid #D4D4CF', outline: 'none' }} />
              </div>
              <div>
                <label htmlFor="surname" className="block text-sm font-medium mb-1" style={{ color: '#5A5A56' }}>Last Name</label>
                <input id="surname" type="text" value={surname} onChange={(e) => setSurname(e.target.value)}
                  placeholder="Dela Cruz" className="w-full px-3 py-3 rounded-lg text-base"
                  style={{ border: '1px solid #D4D4CF', outline: 'none' }} required />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: '#5A5A56' }}>PLMun Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#9A9A95' }} />
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@plmun.edu.ph" className="w-full pl-10 pr-10 py-3 rounded-lg text-base"
                  style={{ border: `1px solid ${email && !isPlmunEmail ? '#9B1C1C' : '#D4D4CF'}`, outline: 'none' }} required />
                {email && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isPlmunEmail
                      ? <CheckCircle2 className="h-5 w-5" style={{ color: '#1A6B3C' }} />
                      : <XCircle className="h-5 w-5" style={{ color: '#9B1C1C' }} />}
                  </span>
                )}
              </div>
              {email && !isPlmunEmail && (
                <p className="text-xs mt-1" style={{ color: '#9B1C1C' }}>Must be a @plmun.edu.ph email address</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: '#5A5A56' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#9A9A95' }} />
                <input id="password" type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" className="w-full pl-10 pr-12 py-3 rounded-lg text-base"
                  style={{ border: '1px solid #D4D4CF', outline: 'none' }} required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#9A9A95' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {password && (
                <p className="text-xs mt-1" style={{ color: hasMinLength ? '#1A6B3C' : '#9B1C1C' }}>
                  {hasMinLength ? '✓ Password meets requirements' : 'Password must be at least 6 characters'}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1" style={{ color: '#5A5A56' }}>Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#9A9A95' }} />
                <input id="confirmPassword" type={showConfirm ? 'text' : 'password'} value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" className="w-full pl-10 pr-12 py-3 rounded-lg text-base"
                  style={{ border: `1px solid ${confirmPassword && !passwordsMatch ? '#9B1C1C' : '#D4D4CF'}`, outline: 'none' }} required />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#9A9A95' }}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="text-xs mt-1" style={{ color: '#9B1C1C' }}>Passwords do not match</p>
              )}
              {confirmPassword && passwordsMatch && (
                <p className="text-xs mt-1" style={{ color: '#1A6B3C' }}>✓ Passwords match</p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#9B1C1C' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={!canSubmit}
              className="w-full py-3 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors hover-lift"
              style={{ backgroundColor: '#6B0000', opacity: !canSubmit ? 0.5 : 1 }}>
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Creating account...</> : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: '#9A9A95' }}>
              Already have an account?{' '}
              <Link href="/login" className="font-medium hover-lift" style={{ color: '#C9972C' }}>Sign In</Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm transition-colors hover-lift" style={{ color: '#5A5A56' }}>
            ← Back to Bulletin
          </Link>
        </div>
      </div>
    </main>
  )
}
