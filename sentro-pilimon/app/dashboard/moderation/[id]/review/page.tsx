import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { BottomTabBar } from '@/components/navigation/BottomTabBar'
import { TopNavBar } from '@/components/navigation/TopNavBar'
import { ReviewPanel } from '@/components/dashboard/ReviewPanel'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getAnnouncement(id: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('announcements')
    .select(`
      id, title, description, start_datetime, end_datetime, venue, poster_url,
      publisher:users!publisher_user_id(full_name, email),
      category:event_categories(name, color),
      organization:organizations(name)
    `)
    .eq('id', id)
    .eq('status', 'pending')
    .single()

  if (!data) return null

  // Normalize array fields to single objects
  return {
    ...data,
    publisher: Array.isArray(data.publisher) ? data.publisher[0] : data.publisher,
    category: Array.isArray(data.category) ? data.category[0] : data.category,
    organization: Array.isArray(data.organization) ? data.organization[0] : data.organization,
  }
}

export default async function ReviewPage({ params }: PageProps) {
  const { id } = await params
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

  const announcement = await getAnnouncement(id)
  if (!announcement) {
    notFound()
  }

  return (
    <main className="min-h-screen pb-24 md:pb-0">
      <TopNavBar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/dashboard/moderation"
          className="inline-flex items-center gap-2 mb-6 text-sm"
          style={{ color: '#5A5A56' }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Queue
        </Link>

        <ReviewPanel announcement={announcement} />
      </div>

      <BottomTabBar />
    </main>
  )
}