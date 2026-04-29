import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { PLMunLogo } from '@/components/shared/PLMunLogo'
import { BottomTabBar } from '@/components/navigation/BottomTabBar'
import { TopNavBar } from '@/components/navigation/TopNavBar'
import { BulletinGrid } from '@/components/bulletin/BulletinGrid'
import { FilterBar } from '@/components/bulletin/FilterBar'
import { CardSkeleton } from '@/components/shared/LoadingSkeleton'
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
  const [categories, announcements] = await Promise.all([
    getCategories(),
    getAnnouncements()
  ])

  const announcementCards = announcements.map(a => ({
    id: a.id,
    title: a.title,
    description: a.description,
    startDate: new Date(a.start_datetime),
    endDate: new Date(a.end_datetime),
    venue: a.venue,
    posterUrl: a.poster_url,
    category: Array.isArray(a.category) ? a.category[0] : a.category,
    organization: a.organization,
    goingCount: 0,
    interestedCount: 0,
  }))

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <TopNavBar />

      {/* Hero Section */}
      <section style={{ backgroundColor: '#6B0000' }} className="py-8 px-4 md:py-12">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <PLMunLogo size="lg" className="hidden md:block" />
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-1" style={{ color: '#FFFFFF' }}>
              {COPY.bulletin.title}
            </h1>
            <p className="text-sm md:text-base" style={{ color: '#C9972C' }}>
              {COPY.bulletin.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="sticky top-0 z-30 bg-white border-b border-plm-gray-200 py-3 px-4 md:py-4">
        <div className="max-w-6xl mx-auto">
          <Suspense fallback={<div className="h-10 bg-plm-gray-100 rounded-lg animate-pulse" />}>
            <FilterBar categories={categories} />
          </Suspense>
        </div>
      </section>

      {/* Announcements Grid */}
      <section className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <BulletinGrid announcements={announcementCards} />
          </Suspense>
        </div>
      </section>

      <BottomTabBar />
    </main>
  )
}