import { createClient } from '@/lib/supabase/server'
import { BottomTabBar } from '@/components/navigation/BottomTabBar'
import { TopNavBar } from '@/components/navigation/TopNavBar'
import { BulletinGrid } from '@/components/bulletin/BulletinGrid'
import { AnnouncementCardProps } from '@/components/bulletin/AnnouncementCard'
import Link from 'next/link'
import { redirect } from 'next/navigation'

async function getFollowedChannelsFeed(userId: string) {
  const supabase = await createClient()

  const { data: follows } = await supabase
    .from('channel_follows')
    .select('channel_type, channel_id')
    .eq('user_id', userId)

  if (!follows || follows.length === 0) {
    return { announcements: [], hasFollows: false }
  }

  const orgIds = follows.filter(f => f.channel_type === 'org').map(f => f.channel_id).filter(Boolean)
  const officeIds = follows.filter(f => f.channel_type === 'department').map(f => f.channel_id).filter(Boolean)

  let query = supabase
    .from('announcements')
    .select(`
      id, title, description, start_datetime, end_datetime, venue, poster_url, poster_crop_x, poster_crop_y, poster_zoom, status,
      category:event_categories(id, name, slug, color),
      organization:organizations(name, logo_url)
    `)
    .eq('status', 'published')

  if (orgIds.length > 0 && officeIds.length > 0) {
    query = query.or(`org_id.in.(${orgIds.join(',')}),office_id.in.(${officeIds.join(',')})`)
  } else if (orgIds.length > 0) {
    query = query.in('org_id', orgIds)
  } else if (officeIds.length > 0) {
    query = query.in('office_id', officeIds)
  } else {
    return { announcements: [], hasFollows: false }
  }

  const { data: announcements } = await query.order('start_datetime', { ascending: true }).limit(20)

  return { announcements: announcements || [], hasFollows: true }
}

export default async function MyFeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { announcements, hasFollows } = await getFollowedChannelsFeed(user.id)

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
    organization: a.organization ? Array.isArray(a.organization) ? a.organization[0] : a.organization : null,
    goingCount: 0,
    interestedCount: 0,
  }))

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <TopNavBar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: '#1A1A18', fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          My Feed
        </h1>
        <p className="mb-6" style={{ color: '#5A5A56' }}>
          {hasFollows ? 'Announcements from channels you follow' : 'Follow channels to see their announcements'}
        </p>

        {!hasFollows ? (
          <div
            className="text-center py-12 px-4 rounded-xl"
            style={{ backgroundColor: '#FAFAF7', border: '1px solid #EBEBEA' }}
          >
            <p className="text-lg font-medium mb-2" style={{ color: '#1A1A18' }}>
              No channels followed yet
            </p>
            <p className="text-sm mb-4" style={{ color: '#5A5A56' }}>
              Visit the Channels page to follow organizations, departments, or clubs.
            </p>
            <Link
              href="/channels"
              className="inline-block px-4 py-2 text-white text-sm font-medium rounded-lg"
              style={{ backgroundColor: '#6B0000' }}
            >
              Browse Channels
            </Link>
          </div>
        ) : (
          <BulletinGrid announcements={announcementCards} />
        )}
      </div>

      <BottomTabBar />
    </main>
  )
}
