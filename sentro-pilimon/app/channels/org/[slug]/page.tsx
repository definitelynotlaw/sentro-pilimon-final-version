import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BottomTabBar } from '@/components/navigation/BottomTabBar'
import { TopNavBar } from '@/components/navigation/TopNavBar'
import { BulletinGrid } from '@/components/bulletin/BulletinGrid'
import { AnnouncementCardProps } from '@/components/bulletin/AnnouncementCard'
import { FollowButton } from '@/components/channels/FollowButton'
import { getOrgBySlug } from '@/data/organizations'
import { ChannelQRButton } from '@/components/channels/ChannelQRButton'

interface PageProps {
  params: Promise<{ slug: string }>
}

interface OrganizationData {
  id: string
  name: string
  slug: string
  accent_color: string
  short_description: string | null
  banner_url: string | null
  logo_url: string | null
  member_count?: number
  type?: string
}

async function getOrganizationChannel(slug: string): Promise<{ org: OrganizationData; announcements: any[] } | null> {
  // First check static data
  const staticOrg = getOrgBySlug(slug)

  const supabase = await createClient()

  // Try to get from database
  const { data: dbOrg } = await supabase
    .from('organizations')
    .select('id, name, slug, accent_color, short_description, banner_url, logo_url, member_count')
    .eq('slug', slug)
    .single()

  // Use DB org if exists, otherwise use static org data
  const org = dbOrg || (staticOrg ? {
    id: staticOrg.id,
    name: staticOrg.name,
    slug: staticOrg.slug,
    accent_color: staticOrg.accent_color,
    short_description: staticOrg.short_description,
    banner_url: staticOrg.logo_url,
    logo_url: staticOrg.logo_url,
    member_count: 0,
  } : null)

  if (!org) return null

  const { data: announcements } = await supabase
    .from('announcements')
    .select(`
      id, title, description, start_datetime, end_datetime, venue, poster_url, poster_crop_x, poster_crop_y, poster_zoom, status,
      category:event_categories(id, name, slug, color)
    `)
    .eq('org_id', org.id)
    .eq('status', 'published')
    .order('start_datetime', { ascending: true })
    .limit(20)

  return { org, announcements: announcements || [] }
}

export default async function OrganizationChannelPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const data = await getOrganizationChannel(slug)

  if (!data) {
    notFound()
  }

  const { org, announcements } = data

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
    organization: { name: org.name, logoUrl: org.logo_url },
    goingCount: 0,
    interestedCount: 0,
  }))

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <TopNavBar />

      {/* Banner */}
      <div
        className="h-32 md:h-48 relative flex items-center justify-center"
        style={{ backgroundColor: org.accent_color || '#6B0000' }}
      >
        {org.banner_url && (
          <img
            src={org.banner_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        )}
        <div className="text-center text-white relative z-10">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold overflow-hidden"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            {org.logo_url ? (
              <img src={org.logo_url} alt={org.name} className="w-full h-full object-cover" />
            ) : (
              org.name.slice(0, 2)
            )}
          </div>
          <h1 className="text-2xl font-bold">{org.name}</h1>
          {org.member_count && org.member_count > 0 && (
            <p className="text-sm opacity-80">{org.member_count} members</p>
          )}
        </div>
      </div>

      {/* Description + Follow */}
      {(org.short_description || user) && (
        <div className="max-w-4xl mx-auto px-4 py-6">
          {org.short_description && <p className="text-center mb-4" style={{ color: '#5A5A56' }}>{org.short_description}</p>}
          {user && (
            <div className="flex justify-center gap-3">
              <FollowButton channelType="org" channelId={org.id} userId={user.id} />
              <ChannelQRButton
                channelUrl={`https://sentro-pilimon-final-version.vercel.app/channels/org/${org.slug}`}
                channelName={org.name}
              />
            </div>
          )}
        </div>
      )}

      {/* Announcements */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#1A1A18' }}>
          Announcements
        </h2>
        {announcementCards.length > 0 ? (
          <BulletinGrid announcements={announcementCards} />
        ) : (
          <div className="text-center py-12" style={{ color: '#9A9A95' }}>
            <p>No announcements yet</p>
            <p className="text-sm mt-1">Check back later for updates from {org.name}</p>
          </div>
        )}
      </div>

      <BottomTabBar />
    </main>
  )
}