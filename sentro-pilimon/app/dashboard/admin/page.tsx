import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BottomTabBar } from '@/components/navigation/BottomTabBar'
import { TopNavBar } from '@/components/navigation/TopNavBar'
import { Users, Grid3X3, FileText, BarChart3, Settings, Shield, ImageIcon, Plus } from 'lucide-react'

export default async function AdminDashboardPage() {
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

  if (profile?.role !== 'admin') {
    redirect('/dashboard/staff')
  }

  // Get stats
  const { count: announcementCount } = await supabase
    .from('announcements')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  const { count: userCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { count: pendingCount } = await supabase
    .from('announcements')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: channelCount } = await supabase
    .from('channels')
    .select('*', { count: 'exact', head: true })

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <TopNavBar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6" style={{ color: '#6B0000' }} />
            <h1
              className="text-2xl font-bold"
              style={{ color: '#1A1A18', fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Admin Dashboard
            </h1>
          </div>
          <p style={{ color: '#5A5A56' }}>
            Welcome back, {profile?.full_name || 'Admin'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white text-center" style={{ border: '1px solid #EBEBEA' }}>
            <p className="text-3xl font-bold" style={{ color: '#6B0000' }}>{userCount || 0}</p>
            <p className="text-sm" style={{ color: '#9A9A95' }}>Users</p>
          </div>
          <div className="p-4 rounded-xl bg-white text-center" style={{ border: '1px solid #EBEBEA' }}>
            <p className="text-3xl font-bold" style={{ color: '#1A6B3C' }}>{announcementCount || 0}</p>
            <p className="text-sm" style={{ color: '#9A9A95' }}>Published</p>
          </div>
          <div className="p-4 rounded-xl bg-white text-center" style={{ border: '1px solid #EBEBEA' }}>
            <p className="text-3xl font-bold" style={{ color: '#C9972C' }}>{pendingCount || 0}</p>
            <p className="text-sm" style={{ color: '#9A9A95' }}>Pending</p>
          </div>
          <div className="p-4 rounded-xl bg-white text-center" style={{ border: '1px solid #EBEBEA' }}>
            <p className="text-3xl font-bold" style={{ color: '#1E3A5F' }}>{channelCount || 0}</p>
            <p className="text-sm" style={{ color: '#9A9A95' }}>Channels</p>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="mb-8">
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: '#1A1A18', fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Administration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/dashboard/admin/users"
              className="p-6 rounded-xl bg-white hover:shadow-md transition-shadow"
              style={{ border: '1px solid #EBEBEA' }}
            >
              <Users className="h-8 w-8 mb-3" style={{ color: '#6B0000' }} />
              <h3 className="font-semibold mb-1" style={{ color: '#1A1A18' }}>User Management</h3>
              <p className="text-sm" style={{ color: '#5A5A56' }}>Manage user roles and permissions</p>
            </Link>

            <Link
              href="/dashboard/admin/categories"
              className="p-6 rounded-xl bg-white hover:shadow-md transition-shadow"
              style={{ border: '1px solid #EBEBEA' }}
            >
              <Grid3X3 className="h-8 w-8 mb-3" style={{ color: '#6B0000' }} />
              <h3 className="font-semibold mb-1" style={{ color: '#1A1A18' }}>Categories</h3>
              <p className="text-sm" style={{ color: '#5A5A56' }}>Manage event categories</p>
            </Link>

            <Link
              href="/dashboard/admin/audit-logs"
              className="p-6 rounded-xl bg-white hover:shadow-md transition-shadow"
              style={{ border: '1px solid #EBEBEA' }}
            >
              <FileText className="h-8 w-8 mb-3" style={{ color: '#6B0000' }} />
              <h3 className="font-semibold mb-1" style={{ color: '#1A1A18' }}>Audit Logs</h3>
              <p className="text-sm" style={{ color: '#5A5A56' }}>View all system activities</p>
            </Link>

            <Link
              href="/dashboard/admin/posts"
              className="p-6 rounded-xl bg-white hover:shadow-md transition-shadow"
              style={{ border: '1px solid #EBEBEA' }}
            >
              <BarChart3 className="h-8 w-8 mb-3" style={{ color: '#6B0000' }} />
              <h3 className="font-semibold mb-1" style={{ color: '#1A1A18' }}>Manage Posts</h3>
              <p className="text-sm" style={{ color: '#5A5A56' }}>View and delete any announcement</p>
            </Link>
          
            <Link
              href="/dashboard/admin/orgs"
              className="p-6 rounded-xl bg-white hover:shadow-md transition-shadow"
              style={{ border: '1px solid #EBEBEA' }}
            >
              <ImageIcon className="h-8 w-8 mb-3" style={{ color: '#6B0000' }} />
              <h3 className="font-semibold mb-1" style={{ color: '#1A1A18' }}>Org Logos</h3>
              <p className="text-sm" style={{ color: '#5A5A56' }}>Upload logos for organizations</p>
            </Link>
          </div>
        </div>

        {/* Post Management */}
        <div className="mb-8">
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: '#1A1A18', fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Post Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/dashboard/officer/create"
              className="p-4 rounded-xl text-white text-center font-medium flex items-center justify-center gap-2"
              style={{ backgroundColor: '#6B0000' }}
            >
              <Plus className="h-5 w-5" />
              Create New Announcement
            </Link>
            <Link
              href="/dashboard/officer"
              className="p-4 rounded-xl text-center font-medium flex items-center justify-center gap-2"
              style={{ backgroundColor: '#F5ECEC', color: '#6B0000' }}
            >
              <FileText className="h-5 w-5" />
              My Announcements
            </Link>
            <Link
              href="/dashboard/moderation"
              className="p-4 rounded-xl text-center font-medium flex items-center justify-center gap-2"
              style={{ backgroundColor: '#F3EEF8', color: '#4A1A7A' }}
            >
              My Announcements
            </Link>
          </div>
        </div>

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
              <Grid3X3 className="h-6 w-6 mx-auto mb-2" style={{ color: '#6B0000' }} />
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