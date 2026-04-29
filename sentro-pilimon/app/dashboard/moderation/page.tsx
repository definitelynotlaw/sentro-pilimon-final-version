import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BottomTabBar } from '@/components/navigation/BottomTabBar'
import { TopNavBar } from '@/components/navigation/TopNavBar'
import { PendingQueue } from '@/components/dashboard/PendingQueue'

export default async function ModerationPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const moderatorRoles = ['moderator', 'admin']
  if (!profile?.role || !moderatorRoles.includes(profile.role)) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <TopNavBar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: '#1A1A18', fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Moderation Queue
        </h1>
        <p className="mb-6" style={{ color: '#5A5A56' }}>
          Review and approve pending announcements
        </p>

        <PendingQueue />
      </div>

      <BottomTabBar />
    </main>
  )
}