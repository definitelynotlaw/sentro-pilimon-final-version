'use client'

import Link from 'next/link'
import { PLMunLogo } from '@/components/shared/PLMunLogo'
import { Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#FAFAF7' }}>
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/"><PLMunLogo size="xl" className="mb-4 hover-lift" /></Link>
          <h1 className="text-2xl font-bold" style={{ color: '#6B0000', fontFamily: "'Playfair Display', Georgia, serif" }}>
            Forgot Password
          </h1>
          <p className="text-sm mt-1" style={{ color: '#5A5A56' }}>Need help accessing your account?</p>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 text-center" style={{ border: '1px solid #EBEBEA', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FFF8EC' }}>
            <Mail className="h-7 w-7" style={{ color: '#C9972C' }} />
          </div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: '#1A1A18' }}>Contact your administrator</h2>
          <p className="text-sm mb-6" style={{ color: '#5A5A56', lineHeight: 1.6 }}>
            Password resets are handled by your system administrator. Please reach out to your department office or IT support for assistance.
          </p>
          <div className="p-3 rounded-lg text-sm mb-6" style={{ backgroundColor: '#F5F5F3', color: '#5A5A56' }}>
            📧 alawrencesalamat@gmail.com
          </div>
          <Link
            href="/login"
            className="text-sm font-medium hover-lift"
            style={{ color: '#6B0000' }}
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </main>
  )
}
