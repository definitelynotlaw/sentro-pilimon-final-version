import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BottomTabBar } from '@/components/navigation/BottomTabBar'
import { TopNavBar } from '@/components/navigation/TopNavBar'
import { Plus, FileText, AlertCircle, CheckCircle, Users } from 'lucide-react'

export default async function StaffDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  const allowedRoles = ['moderator', 'officer', 'office_staff', 'admin']
  if (!profile?.role || !allowedRoles.includes(profile.role)) {
    redirect('/dashboard/student')
  }

  const roleLabels: Record<string, string> = {
    moderator: 'Moderator',
    officer: 'Organization Officer',
    office_staff: 'Office Staff',
    admin: 'Admin',
  }

  const roleColors: Record<string, string> = {
    moderator: '#4A1A7A',
    officer: '#1A6B3C',
    office_staff: '#7B3F00',
    admin: '#6B0000',
  }

  // Get stats
  const { count: myAnnouncements } = await supabase
    .from('announcements')
    .select('*', { count: 'exact', head: true })
    .eq('publisher_user_id', user.id)

  const { count: pendingCount } = await supabase
    .from('announcements')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: publishedCount } = await supabase
    .from('announcements')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <TopNavBar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome header */}
        <div className="mb-8">
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: '#1A1A18', fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {roleLabels[profile?.role] || 'Staff'} Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 text-xs font-semibold rounded-full text-white capitalize"
              style={{ backgroundColor: roleColors[profile?.role] }}
            >
              {profile?.role}
            </span>
            <span style={{ color: '#5A5A56' }}>
              {profile?.full_name || user.email?.split('@')[0]}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white text-center" style={{ border: '1px solid #EBEBEA' }}>
            <p className="text-3xl font-bold" style={{ color: '#6B0000' }}>{publishedCount || 0}</p>
            <p className="text-sm" style={{ color: '#9A9A95' }}>Published</p>
          </div>
          <div className="p-4 rounded-xl bg-white text-center" style={{ border: '1px solid #EBEBEA' }}>
            <p className="text-3xl font-bold" style={{ color: '#C9972C' }}>{pendingCount || 0}</p>
            <p className="text-sm" style={{ color: '#9A9A95' }}>Pending</p>
          </div>
          <div className="p-4 rounded-xl bg-white text-center" style={{ border: '1px solid #EBEBEA' }}>
            <p className="text-3xl font-bold" style={{ color: '#1A6B3C' }}>{myAnnouncements || 0}</p>
            <p className="text-sm" style={{ color: '#9A9A95' }}>My Posts</p>
          </div>
        </div>

        {/* Moderator Section */}
        {profile?.role === 'moderator' && (
          <div className="mb-8">
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: '#1A1A18', fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <AlertCircle className="inline h-5 w-5 mr-2" style={{ color: '#4A1A7A' }} />
              Moderation
            </h2>
            <Link
              href="/dashboard/moderation"
              className="inline-flex items-center gap-2 p-4 rounded-xl text-white font-medium"
              style={{ backgroundColor: '#4A1A7A' }}
            >
              <CheckCircle className="h-5 w-5" />
              Review Pending ({pendingCount || 0})
            </Link>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Link
                href="/dashboard/officer/create"
                className="p-4 rounded-xl text-white text-center font-medium flex items-center justify-center gap-2"
                style={{ backgroundColor: '#6B0000' }}
              >
                <Plus className="h-5 w-5" />
                Create New
              </Link>
              <Link
                href="/dashboard/officer"
                className="p-4 rounded-xl text-center font-medium flex items-center justify-center gap-2"
                style={{ backgroundColor: '#F5ECEC', color: '#6B0000' }}
              >
                <FileText className="h-5 w-5" />
                My Announcements
              </Link>
            </div>
          </div>
        )}

        {/* Officer/Staff Section */}
        {(profile?.role === 'officer' || profile?.role === 'office_staff' || profile?.role === 'admin') && (
          <div className="mb-8">
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: '#1A1A18', fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <Plus className="inline h-5 w-5 mr-2" style={{ color: '#6B0000' }} />
              Announcement Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/dashboard/officer/create"
                className="p-4 rounded-xl text-white text-center font-medium flex items-center justify-center gap-2"
                style={{ backgroundColor: '#6B0000' }}
              >
                <Plus className="h-5 w-5" />
                Create New
              </Link>
              <Link
                href="/dashboard/officer"
                className="p-4 rounded-xl text-center font-medium flex items-center justify-center gap-2"
                style={{ backgroundColor: '#F5ECEC', color: '#6B0000' }}
              >
                <FileText className="h-5 w-5" />
                My Announcements
              </Link>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="mb-8">
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: '#1A1A18', fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Quick Links
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/channels"
              className="p-4 rounded-xl bg-white text-center font-medium"
              style={{ border: '1px solid #EBEBEA' }}
            >
              <svg className="h-6 w-6 mx-auto mb-2" style={{ color: '#6B0000' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span className="text-sm" style={{ color: '#1A1A18' }}>Channels</span>
            </Link>
            <Link
              href="/my-feed"
              className="p-4 rounded-xl bg-white text-center font-medium"
              style={{ border: '1px solid #EBEBEA' }}
            >
              <svg className="h-6 w-6 mx-auto mb-2" style={{ color: '#6B0000' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="text-sm" style={{ color: '#1A1A18' }}>My Feed</span>
            </Link>
            <Link
              href="/scan"
              className="p-4 rounded-xl bg-white text-center font-medium"
              style={{ border: '1px solid #EBEBEA' }}
            >
              <svg className="h-6 w-6 mx-auto mb-2" style={{ color: '#6B0000' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <span className="text-sm" style={{ color: '#1A1A18' }}>Scan QR</span>
            </Link>
            <Link
              href="/profile"
              className="p-4 rounded-xl bg-white text-center font-medium"
              style={{ border: '1px solid #EBEBEA' }}
            >
              <Users className="h-6 w-6 mx-auto mb-2" style={{ color: '#6B0000' }} />
              <span className="text-sm" style={{ color: '#1A1A18' }}>Profile</span>
            </Link>
          </div>
        </div>
      </div>

      <BottomTabBar />
    </main>
  )
}