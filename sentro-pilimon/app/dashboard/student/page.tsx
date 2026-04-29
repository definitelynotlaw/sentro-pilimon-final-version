import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BottomTabBar } from '@/components/navigation/BottomTabBar'
import { TopNavBar } from '@/components/navigation/TopNavBar'
import { Calendar, Star, Users, Grid3X3 } from 'lucide-react'

export default async function StudentDashboardPage() {
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

  const allowedRoles = ['student', 'admin']
  if (profile?.role && !allowedRoles.includes(profile.role)) {
    if (['moderator', 'officer', 'office_staff'].includes(profile.role)) {
      redirect('/dashboard/staff')
    }
  }

  // Get student stats
  const { count: myRsvps } = await supabase
    .from('rsvp_records')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: following } = await supabase
    .from('channel_follows')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: upcomingEvents } = await supabase
    .from('announcements')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')
    .gte('start_datetime', new Date().toISOString())

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
            Welcome, {profile?.full_name || user.email?.split('@')[0]}!
          </h1>
          <span
            className="px-2 py-0.5 text-xs font-semibold rounded-full text-white capitalize"
            style={{ backgroundColor: '#1E3A5F' }}
          >
            {profile?.role || 'student'}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white text-center" style={{ border: '1px solid #EBEBEA' }}>
            <p className="text-3xl font-bold" style={{ color: '#1E3A5F' }}>{upcomingEvents || 0}</p>
            <p className="text-sm" style={{ color: '#9A9A95' }}>Upcoming</p>
          </div>
          <div className="p-4 rounded-xl bg-white text-center" style={{ border: '1px solid #EBEBEA' }}>
            <p className="text-3xl font-bold" style={{ color: '#6B0000' }}>{myRsvps || 0}</p>
            <p className="text-sm" style={{ color: '#9A9A95' }}>RSVPs</p>
          </div>
          <div className="p-4 rounded-xl bg-white text-center" style={{ border: '1px solid #EBEBEA' }}>
            <p className="text-3xl font-bold" style={{ color: '#1A6B3C' }}>{following || 0}</p>
            <p className="text-sm" style={{ color: '#9A9A95' }}>Following</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: '#1A1A18', fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/my-feed"
              className="p-4 rounded-xl text-white text-center font-medium flex items-center justify-center gap-2"
              style={{ backgroundColor: '#1E3A5F' }}
            >
              <Calendar className="h-5 w-5" />
              My Feed
            </Link>
            <Link
              href="/channels"
              className="p-4 rounded-xl text-center font-medium flex items-center justify-center gap-2"
              style={{ backgroundColor: '#F0ECE7', color: '#1E3A5F' }}
            >
              <Grid3X3 className="h-5 w-5" />
              Browse Channels
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: '#1A1A18', fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Explore
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/channels"
              className="p-4 rounded-xl bg-white text-center font-medium"
              style={{ border: '1px solid #EBEBEA' }}
            >
              <Grid3X3 className="h-6 w-6 mx-auto mb-2" style={{ color: '#1E3A5F' }} />
              <span className="text-sm" style={{ color: '#1A1A18' }}>Channels</span>
            </Link>
            <Link
              href="/my-feed"
              className="p-4 rounded-xl bg-white text-center font-medium"
              style={{ border: '1px solid #EBEBEA' }}
            >
              <Calendar className="h-6 w-6 mx-auto mb-2" style={{ color: '#1E3A5F' }} />
              <span className="text-sm" style={{ color: '#1A1A18' }}>My Feed</span>
            </Link>
            <Link
              href="/scan"
              className="p-4 rounded-xl bg-white text-center font-medium"
              style={{ border: '1px solid #EBEBEA' }}
            >
              <svg className="h-6 w-6 mx-auto mb-2" style={{ color: '#1E3A5F' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <span className="text-sm" style={{ color: '#1A1A18' }}>Scan QR</span>
            </Link>
            <Link
              href="/profile"
              className="p-4 rounded-xl bg-white text-center font-medium"
              style={{ border: '1px solid #EBEBEA' }}
            >
              <Users className="h-6 w-6 mx-auto mb-2" style={{ color: '#1E3A5F' }} />
              <span className="text-sm" style={{ color: '#1A1A18' }}>Profile</span>
            </Link>
          </div>
        </div>
      </div>

      <BottomTabBar />
    </main>
  )
}