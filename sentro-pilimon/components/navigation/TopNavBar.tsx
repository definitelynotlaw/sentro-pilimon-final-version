'use client'

import { useState, useEffect, useRef } from 'react'
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
      className="hidden md:block sticky top-0 z-40 bg-white"
      style={{ borderBottom: '1px solid #D4D4CF' }}
    >
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 hover-lift" style={{ opacity: 0.8 }}>
            <PLMunLogo size="sm" />
            <span
              className="font-display text-xl font-bold"
              style={{ color: '#6B0000', fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Sentro Pilimon
            </span>
          </Link>

          <nav className="flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href))

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors relative py-2 nav-link"
                  style={{
                    color: isActive ? '#6B0000' : '#5A5A56',
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

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
              style={{ color: '#9A9A95' }}
            />
            <input
              type="search"
              placeholder="Search announcements..."
              className="w-64 pl-10 pr-4 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: '#F5F5F3',
                border: '1px solid #D4D4CF',
                outline: 'none',
              }}
            />
          </div>

          {isHydrated && isAuthenticated && profile ? (
            /* User Menu Dropdown */
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover-lift"
                style={{ backgroundColor: isUserMenuOpen ? '#F5F5F3' : 'transparent' }}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold overflow-hidden"
                  style={{ backgroundColor: roleColors[profile.role] || '#6B0000' }}
                >
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    profile.full_name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <span className="text-sm font-medium" style={{ color: '#1A1A18' }}>
                  {profile.full_name?.split(' ')[0] || 'User'}
                </span>
                <ChevronDown
                  className="h-4 w-4 transition-transform"
                  style={{ color: '#5A5A56', transform: isUserMenuOpen ? 'rotate(180deg)' : 'none' }}
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
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover-lift"
                style={{
                  backgroundColor: 'transparent',
                  color: '#6B0000',
                }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover-lift"
                style={{
                  backgroundColor: '#6B0000',
                  color: 'white',
                }}
              >
                Register
              </Link>
            </div>
          ) : null}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg transition-colors md:hidden"
            style={{ backgroundColor: 'transparent' }}
            aria-label="Open menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" style={{ color: '#5A5A56' }} />
            ) : (
              <Menu className="h-5 w-5" style={{ color: '#5A5A56' }} />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}