import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BottomTabBar } from '@/components/navigation/BottomTabBar'
import { TopNavBar } from '@/components/navigation/TopNavBar'
import { AnnouncementList } from '@/components/dashboard/AnnouncementList'

export default async function OfficerDashboardPage() {
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

  const officerRoles = ['officer', 'office_staff', 'admin', 'moderator']
  if (!profile?.role || !officerRoles.includes(profile.role)) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <TopNavBar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: '#1A1A18', fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            My Announcements
          </h1>
          <p style={{ color: '#5A5A56' }}>
            Create and manage your organization's announcements
          </p>
        </div>

        {/* Help text for new users */}
        <div
          className="mb-6 p-4 rounded-xl text-sm"
          style={{ backgroundColor: '#F5F5F3', color: '#5A5A56' }}
        >
          <p className="mb-2"><strong>To publish an announcement:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click <Link href="/dashboard/officer/create" className="underline" style={{ color: '#6B0000' }}>New</Link> to create an announcement</li>
            <li>Fill in the details and submit</li>
            <li>A moderator will review and publish it</li>
            <li>Once approved, it will appear on the public bulletin</li>
          </ol>
        </div>

        {/* Announcement List */}
        <AnnouncementList userId={user.id} />
      </div>

      <BottomTabBar />
    </main>
  )
}