'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import type { User as SupabaseAuthUser, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@/types/database'
import { useRouter } from 'next/navigation'

interface AuthUser extends SupabaseAuthUser {
  role?: string
  full_name?: string
}

interface ExtendedProfile extends User {
  avatar_url?: string | null
}

interface AuthContextType {
  user: AuthUser | null
  profile: ExtendedProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  isHydrated: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<ExtendedProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)
  const supabase = createClient()
  const fetchProfileRef = useRef<(() => Promise<void>) | null>(null)

  const fetchProfile = useCallback(async (authUser: AuthUser) => {
    const { data: profileData } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (profileData) {
      setProfile(profileData as ExtendedProfile)
    } else {
      setProfile({
        id: authUser.id,
        email: authUser.email || '',
        full_name: authUser.user_metadata?.full_name || 'User',
        role: (authUser.user_metadata?.role as ExtendedProfile['role']) || 'student',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        avatar_url: authUser.user_metadata?.avatar_url || null,
      })
    }
  }, [supabase])

  const refreshProfile = useCallback(async () => {
    if (!user) return
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser) {
      await fetchProfile(authUser as AuthUser)
    }
  }, [user, supabase, fetchProfile])

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (authUser) {
          setUser(authUser as AuthUser)
          await fetchProfile(authUser as AuthUser)
        }
      } catch (error) {
        console.error('Auth init error:', error)
      } finally {
        setIsLoading(false)
        setIsHydrated(true)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user as AuthUser)
          await fetchProfile(session.user as AuthUser)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          router.push('/login')
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user as AuthUser)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, fetchProfile])

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      router.push('/login')
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }, [supabase, router])

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    isHydrated,
    signOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}