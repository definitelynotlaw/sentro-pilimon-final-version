export const revalidate = 0

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PLMunLogo } from '@/components/shared/PLMunLogo'
import { BottomTabBar } from '@/components/navigation/BottomTabBar'
import { TopNavBar } from '@/components/navigation/TopNavBar'
import { BulletinFeed } from '@/components/bulletin/BulletinFeed'
import { COPY } from '@/constants/copy'
import type { EventCategory } from '@/types/database'

async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('event_categories')
    .select('*')
    .order('sort_order')
  return data as EventCategory[] || []
}

async function getRsvpCounts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('rsvp_records')
    .select('announcement_id, rsvp_status')
  return data || []
}

async function getAnnouncements() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('announcements')
    .select(`
      *,
      category:event_categories(*),
      organization:organizations(*)
    `)
    .eq('status', 'published')
    .order('start_datetime', { ascending: true })
    .limit(20)

  return data || []
}

export default async function HomePage() {
  const [categories, announcements, rsvpData] = await Promise.all([
    getCategories(),
    getAnnouncements(),
    getRsvpCounts()
  ])

  const announcementCards = announcements.map(a => ({
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
    organization: a.organization,
    goingCount: rsvpData.filter(r => r.announcement_id === a.id && r.rsvp_status === 'going').length,
    interestedCount: rsvpData.filter(r => r.announcement_id === a.id && r.rsvp_status === 'interested').length,
  }))

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <TopNavBar />

      {/* Hero Section */}
      <section className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="block p-6 rounded-xl text-white transition-transform hover:scale-[1.01]"
            style={{ backgroundColor: '#6B0000' }}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <PLMunLogo size="lg" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1
                    className="text-xl font-bold"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {COPY.bulletin.title}
                  </h1>
                  <span
                    className="px-2 py-0.5 text-xs font-medium rounded-full"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    Official
                  </span>
                </div>
                <p className="text-sm opacity-80">
                  {COPY.bulletin.subtitle}
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 opacity-60"
                aria-hidden="true"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </Link>
        </div>
      </section>

      {/* Announcements Grid */}
      <section className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <BulletinFeed
            announcements={announcementCards}
            categories={categories}
          />
        </div>
      </section>

      <BottomTabBar />
    </main>
  )
}