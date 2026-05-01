import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BottomTabBar } from '@/components/navigation/BottomTabBar'
import { TopNavBar } from '@/components/navigation/TopNavBar'
import { PLMunLogo } from '@/components/shared/PLMunLogo'
import { BulletinGrid } from '@/components/bulletin/BulletinGrid'
import { AnnouncementCardProps } from '@/components/bulletin/AnnouncementCard'
import { FollowButton } from '@/components/channels/FollowButton'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getDepartmentChannel(slug: string) {
  const supabase = await createClient()

  const { data: dept } = await supabase
    .from('offices')
    .select('id, name, slug, accent_color, short_description, college, banner_url, logo_url')
    .eq('slug', slug)
    .single()

  if (!dept) return null

  const { data: announcements } = await supabase
    .from('announcements')
    .select(`
      id, title, description, start_datetime, end_datetime, venue, poster_url, poster_crop_x, poster_crop_y, poster_zoom, status,
      category:event_categories(id, name, slug, color)
    `)
    .eq('office_id', dept.id)
    .eq('status', 'published')
    .order('start_datetime', { ascending: true })
    .limit(20)

  return { dept, announcements: announcements || [] }
}

export default async function DepartmentChannelPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const data = await getDepartmentChannel(slug)

  if (!data) {
    notFound()
  }

  const { dept, announcements } = data

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
        style={{ backgroundColor: dept.accent_color || '#6B0000' }}
      >
        {dept.banner_url && (
          <img
            src={dept.banner_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        )}
        <div className="text-center text-white relative z-10">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            {dept.logo_url ? (
              <img src={dept.logo_url} alt={dept.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              dept.name.slice(0, 2)
            )}
          </div>
          <h1 className="text-2xl font-bold">{dept.name}</h1>
          {dept.college && (
            <p className="text-sm opacity-80">{dept.college}</p>
          )}
        </div>
      </div>

      {/* Description + Follow */}
      {(dept.short_description || user) && (
        <div className="max-w-4xl mx-auto px-4 py-6">
          {dept.short_description && <p className="text-center mb-4" style={{ color: '#5A5A56' }}>{dept.short_description}</p>}
          {user && <div className="flex justify-center"><FollowButton channelType="department" channelId={dept.id} userId={user.id} /></div>}
        </div>
      )}

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