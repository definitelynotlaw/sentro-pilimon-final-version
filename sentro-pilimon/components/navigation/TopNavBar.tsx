'use client'

import { useState, useEffect, useRef } from 'react'
const useSearchQuery = () => {
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get('q') || ''
}
const useSearchQuery = () => {
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get('q') || ''
}
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Search, Menu, X, User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { PLMunLogo } from '@/components/shared/PLMunLogo'
import { useAuth } from '@/context/AuthContext'

const roleColors: Record<string, string> = {
  student: '#1E3A5F',
  officer: '#1A6B3C',
  office_staff: '#7B3F00',
  moderator: '#4A1A7A',
  admin: '#6B0000',
}

export function TopNavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { profile, isAuthenticated, isHydrated, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isUserMenuOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setIsUserMenuOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  const handleSignOut = async () => {
    setIsUserMenuOpen(false)
    await signOut()
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/channels', label: 'Channels' },
    { href: '/about', label: 'About' },
  ]

  return (
    <header
      className="sticky top-0 z-40"
      style={{ backgroundColor: '#6B0000', borderBottom: '2px solid #1A1A18' }}
    >
      <div className="flex items-center justify-between h-14 px-4 md:h-16 md:px-6">
        {/* Left: Logo + Nav (desktop only) */}
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="hidden md:flex items-center gap-2 md:gap-3">
            <PLMunLogo size="sm" />
            <span
              className="font-display text-base md:text-xl font-bold"
              style={{ color: 'white', fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Sentro Pilimon
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href))

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors relative py-2 nav-link"
                  style={{
                    color: isActive ? '#C9972C' : 'rgba(255,255,255,0.8)',
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0 rounded-full"
                      style={{
                        height: '2px',
                        backgroundColor: '#C9972C',
                      }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Center: Logo + Text (mobile only) */}
        <div className="flex md:hidden absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="flex items-center gap-2">
            <PLMunLogo size="sm" />
            <span
              className="font-display text-base font-bold"
              style={{ color: 'white', fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Sentro Pilimon
            </span>
          </Link>
        </div>

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:block relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            />
            <input
              type="search"
              placeholder="Search announcements..."
              defaultValue={typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('q') || '' : ''}
              onChange={(e) => {
                const params = new URLSearchParams(window.location.search)
                if (e.target.value) { params.set('q', e.target.value) } else { params.delete('q') }
                window.history.replaceState(null, '', '?' + params.toString())
                window.dispatchEvent(new Event('searchupdate'))
              }}
              className="w-64 pl-10 pr-4 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                outline: 'none',
                color: 'white',
              }}
            />
          </div>

          {isHydrated && isAuthenticated && profile ? (
            /* User Menu Dropdown - hidden on mobile, shown by BottomTabBar */
            <div className="relative hidden lg:block">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: isUserMenuOpen ? 'rgba(255,255,255,0.2)' : 'transparent' }}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                <div
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold overflow-hidden"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    profile.full_name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <span className="hidden sm:inline text-sm font-medium" style={{ color: 'white' }}>
                  {profile.full_name?.split(' ')[0] || 'User'}
                </span>
                <ChevronDown
                  className="h-4 w-4 transition-transform hidden sm:block"
                  style={{ color: 'rgba(255,255,255,0.8)', transform: isUserMenuOpen ? 'rotate(180deg)' : 'none' }}
                />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border z-50"
                  style={{ borderColor: '#EBEBEA', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                >
                  <div className="p-3 border-b" style={{ borderColor: '#EBEBEA' }}>
                    <p className="text-sm font-medium" style={{ color: '#1A1A18' }}>
                      {profile.full_name}
                    </p>
                    <p className="text-xs capitalize" style={{ color: '#9A9A95' }}>
                      {profile.role}
                    </p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover-lift"
                      style={{ color: '#5A5A56' }}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/settings/account"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover-lift"
                      style={{ color: '#5A5A56' }}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Account Settings
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover-lift"
                      style={{ color: '#5A5A56' }}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Preferences
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover-lift"
                      style={{ color: '#9B1C1C' }}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : isHydrated ? (
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/login"
                className="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.4)',
                }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{
                  backgroundColor: 'white',
                  color: '#6B0000',
                }}
              >
                Register
              </Link>
            </div>
          ) : null}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg transition-colors hidden"
            style={{ backgroundColor: 'transparent' }}
            aria-label="Open menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" style={{ color: 'white' }} />
            ) : (
              <Menu className="h-5 w-5" style={{ color: 'white' }} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t" style={{ borderColor: '#1A1A18', backgroundColor: '#6B0000' }}>
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href))

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    color: isActive ? '#C9972C' : 'rgba(255,255,255,0.8)',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}