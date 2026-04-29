'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Shield, LogOut, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface UserProfile {
  id: string
  email: string
  full_name: string
  role: string
  avatar_url?: string
  org_id?: string
  office_id?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profile) {
        setUser(profile)
      } else {
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.full_name || 'User',
          role: authUser.user_metadata?.role || 'student',
        })
      }
      setIsLoading(false)
    }

    getProfile()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const roleColors: Record<string, string> = {
    student: '#1E3A5F',
    officer: '#1A6B3C',
    office_staff: '#7B3F00',
    moderator: '#4A1A7A',
    admin: '#6B0000',
  }

  if (isLoading) {
    return (
      <main className="min-h-screen pb-20 md:pb-0 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <div
        className="p-6 text-white text-center"
        style={{ backgroundColor: '#6B0000' }}
      >
        <div
          className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold"
          style={{ backgroundColor: roleColors[user?.role || 'student'] }}
        >
          {user?.full_name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <h1 className="text-xl font-bold">{user?.full_name}</h1>
        <p className="text-sm opacity-80 capitalize">{user?.role}</p>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Account Info */}
        <div
          className="p-4 rounded-xl bg-white mb-4"
          style={{ border: '1px solid #EBEBEA' }}
        >
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#5A5A56' }}>Account</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5F5F3' }}>
                <User className="h-5 w-5" style={{ color: '#5A5A56' }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#9A9A95' }}>Name</p>
                <p className="font-medium" style={{ color: '#1A1A18' }}>{user?.full_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5F5F3' }}>
                <Mail className="h-5 w-5" style={{ color: '#5A5A56' }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#9A9A95' }}>Email</p>
                <p className="font-medium" style={{ color: '#1A1A18' }}>{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5F5F3' }}>
                <Shield className="h-5 w-5" style={{ color: '#5A5A56' }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#9A9A95' }}>Role</p>
                <span
                  className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full text-white capitalize"
                  style={{ backgroundColor: roleColors[user?.role || 'student'] }}
                >
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* My RSVPs */}
        <a
          href="/my-rsvps"
          className="flex items-center gap-3 p-4 rounded-xl bg-white mb-4 transition-colors"
          style={{ border: '1px solid #EBEBEA' }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5F5F3' }}>
            <Star className="h-5 w-5" style={{ color: '#5A5A56' }} />
          </div>
          <div className="flex-1">
            <p className="font-medium" style={{ color: '#1A1A18' }}>My RSVPs</p>
            <p className="text-sm" style={{ color: '#9A9A95' }}>View your event registrations</p>
          </div>
          <span style={{ color: '#9A9A95' }}>→</span>
        </a>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 p-4 rounded-xl transition-colors"
          style={{ backgroundColor: '#FEF2F2' }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEE2E2' }}>
            <LogOut className="h-5 w-5" style={{ color: '#9B1C1C' }} />
          </div>
          <span className="font-medium" style={{ color: '#9B1C1C' }}>Sign Out</span>
        </button>
      </div>
    </main>
  )
}