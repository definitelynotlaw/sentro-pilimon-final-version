import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BottomTabBar } from '@/components/navigation/BottomTabBar'
import { TopNavBar } from '@/components/navigation/TopNavBar'
import { PLMunLogo } from '@/components/shared/PLMunLogo'
import { BulletinGrid } from '@/components/bulletin/BulletinGrid'
import { AnnouncementCardProps } from '@/components/bulletin/AnnouncementCard'
import { FollowButton } from '@/components/channels/FollowButton'

async function getPLMunAnnouncements() {
  const supabase = await createClient()

  // Get announcements that have neither org_id nor office_id (PLMun General)
  const { data: announcements } = await supabase
    .from('announcements')
    .select(`
      id, title, description, start_datetime, end_datetime, venue, poster_url, poster_crop_x, poster_crop_y, poster_zoom, status,
      category:event_categories(id, name, slug, color)
    `)
    .is('org_id', null)
    .is('office_id', null)
    .eq('status', 'published')
    .order('start_datetime', { ascending: true })
    .limit(20)

  return announcements || []
}

export default async function PLMunChannelPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const announcements = await getPLMunAnnouncements()

  const announcementCards: AnnouncementCardProps[] = announcements.map(a => ({
    id: a.id,
    title: a.title,
    description: a.description,
    startDate: new Date(a.start_datetime),
    endDate: new Date(a.end_datetime),
    venue: a.venue,
    posterUrl: a.poster_url,
    posterCropX: a.poster_crop_x || 0,
    posterCropY: a.poster_crop_y || 0,
    posterZoom: a.poster_zoom || 1,
    category: Array.isArray(a.category) ? a.category[0] : a.category,
    organization: null,
    goingCount: 0,
    interestedCount: 0,
  }))

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <TopNavBar />

      {/* Banner */}
      <div
        className="h-32 md:h-48 relative flex items-center justify-center"
        style={{ backgroundColor: '#6B0000' }}
      >
        <div className="text-center text-white relative z-10">
          <Link href="/" className="mx-auto mb-3 inline-block">
            <PLMunLogo size="xl" />
          </Link>
          <h1 className="text-2xl font-bold">PLMun General</h1>
          <p className="text-sm opacity-80">Official campus-wide announcements</p>
        </div>
      </div>

      {/* Description + Follow */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-center mb-4" style={{ color: '#5A5A56' }}>Official campus-wide announcements from PLMun administration</p>
        {user && <div className="flex justify-center"><FollowButton channelType="plmun" channelId={null} userId={user.id} /></div>}
      </div>

      {/* Announcements */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#1A1A18' }}>
          Announcements
        </h2>
        <BulletinGrid announcements={announcementCards} />
      </div>

      <BottomTabBar />
    </main>
  )
}