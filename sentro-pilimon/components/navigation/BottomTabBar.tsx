'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, List, ScanLine, Star, User, Settings, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export function BottomTabBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isHydrated, signOut, profile } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = async () => {
    setIsMenuOpen(false)
    await signOut()
    router.push('/')
  }

  const publicTabs = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/channels', label: 'Channels', icon: List },
    { href: '/scan', label: 'Scan', icon: ScanLine },
    { href: '/my-feed', label: 'My Feed', icon: Star },
  ]

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isAuthenticated) {
      setIsMenuOpen(true)
    } else {
      router.push('/login')
    }
  }

  return (
    <>
      {/* Mobile bottom navigation - only show on small screens */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-white lg:hidden"
        style={{ borderTop: '1px solid #D4D4CF' }}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around h-16 px-2">
          {publicTabs.map((tab) => {
            const isActive = pathname === tab.href ||
              (tab.href !== '/' && pathname.startsWith(tab.href))

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center justify-center w-16 h-14 rounded-lg transition-colors"
                style={{
                  color: isActive ? '#6B0000' : '#5A5A56',
                  backgroundColor: 'transparent',
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                <tab.icon
                  className="h-5 w-5 mb-1"
                  style={isActive ? { strokeWidth: 2.5 } : {}}
                />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </Link>
            )
          })}

          {/* Profile Tab - opens menu on mobile */}
          <button
            onClick={handleProfileClick}
            className="flex flex-col items-center justify-center w-16 h-14 rounded-lg transition-colors"
            style={{
              color: pathname === '/profile' ? '#6B0000' : '#5A5A56',
              backgroundColor: 'transparent',
            }}
            aria-label="Profile menu"
          >
            <User
              className="h-5 w-5 mb-1"
              style={pathname === '/profile' ? { strokeWidth: 2.5 } : {}}
            />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </nav>

      {/* Mobile user menu modal */}
      {isHydrated && isAuthenticated && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          style={{ display: isMenuOpen ? 'block' : 'none' }}
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="absolute bottom-16 left-0 right-0 bg-white rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 rounded-full mx-auto mb-4" style={{ backgroundColor: '#D4D4CF' }} />
            <div className="flex items-center gap-3 mb-4 p-3 rounded-lg" style={{ backgroundColor: '#F5F5F3' }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: '#6B0000' }}
              >
                {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-medium text-sm" style={{ color: '#1A1A18' }}>{profile?.full_name}</p>
                <p className="text-xs capitalize" style={{ color: '#9A9A95' }}>{profile?.role}</p>
              </div>
            </div>
            <div className="space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors"
                style={{ color: '#1A1A18' }}
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors"
                style={{ color: '#1A1A18' }}
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span className="font-medium">My Profile</span>
              </Link>
              <Link
                href="/my-rsvps"
                className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors"
                style={{ color: '#1A1A18' }}
                onClick={() => setIsMenuOpen(false)}
              >
                <Star className="h-5 w-5" />
                <span className="font-medium">My RSVPs</span>
              </Link>
              <Link
                href="/settings/account"
                className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors"
                style={{ color: '#1A1A18' }}
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">Account Settings</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors"
                style={{ color: '#9B1C1C' }}
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}