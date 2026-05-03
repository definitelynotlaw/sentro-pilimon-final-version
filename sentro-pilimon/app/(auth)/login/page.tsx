'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PLMunLogo } from '@/components/shared/PLMunLogo'
import { Mail, Lock, Loader2, Eye, EyeOff, PartyPopper } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [showRegisteredModal, setShowRegisteredModal] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) router.push('/dashboard')
    }
    checkAuth()
    if (searchParams.get('registered') === 'true') {
      setShowRegisteredModal(true)
    }
  }, [router, supabase, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    if (!email) { setError('Email is required'); setIsLoading(false); return }
    if (!password) { setError('Password is required'); setIsLoading(false); return }
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message === 'Invalid login credentials'
          ? 'Incorrect email or password. Please try again.'
          : error.message)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Registration Success Modal */}
      {showRegisteredModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-8 text-center"
            style={{ backgroundColor: '#FAFAF7', border: '1px solid #EBEBEA', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: '#EDF7F0' }}
            >
              <PartyPopper className="h-10 w-10" style={{ color: '#1A6B3C' }} />
            </div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: '#6B0000', fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Registration Successful!
            </h2>
            <p className="text-sm mb-1" style={{ color: '#5A5A56' }}>
              Welcome to Sentro Pilimon! Your PLMun account is ready.
            </p>
            <p className="text-sm mb-6" style={{ color: '#9A9A95' }}>
              Sign in below to access the campus bulletin.
            </p>
            <button
              onClick={() => setShowRegisteredModal(false)}
              className="w-full py-3 text-white font-medium rounded-lg hover-lift transition-colors"
              style={{ backgroundColor: '#6B0000' }}
            >
              Sign In Now →
            </button>
          </div>
        </div>
      )}

      <main className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#FAFAF7' }}>
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <Link href="/"><PLMunLogo size="xl" className="mb-4 hover-lift" /></Link>
            <h1 className="text-2xl font-bold" style={{ color: '#6B0000', fontFamily: "'Playfair Display', Georgia, serif" }}>
              Sentro Pilimon
            </h1>
            <p className="text-sm mt-1" style={{ color: '#5A5A56' }}>Sign in to your PLMun account</p>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8" style={{ border: '1px solid #EBEBEA', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: '#5A5A56' }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#9A9A95' }} />
                  <input
                    id="email" type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@plmun.edu.ph"
                    className="w-full pl-10 pr-4 py-3 rounded-lg text-base"
                    style={{ border: '1px solid #D4D4CF', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: '#5A5A56' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#9A9A95' }} />
                  <input
                    id="password" type={showPassword ? 'text' : 'password'} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-lg text-base"
                    style={{ border: '1px solid #D4D4CF', outline: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#9A9A95' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#9B1C1C' }}>
                  {error}
                </div>
              )}

              <button
                type="submit" disabled={isLoading}
                className="w-full py-3 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors hover-lift"
                style={{ backgroundColor: '#6B0000', opacity: isLoading ? 0.5 : 1 }}
              >
                {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Signing in...</> : 'Sign In'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <Link href="/forgot-password" className="text-sm transition-colors mr-4 hover-lift" style={{ color: '#C9972C' }}>
                Forgot your password?
              </Link>
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm" style={{ color: '#9A9A95' }}>
                No account yet?{' '}
                <Link href="/register" className="font-medium hover-lift" style={{ color: '#6B0000' }}>Register</Link>
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
    </>
  )
}
