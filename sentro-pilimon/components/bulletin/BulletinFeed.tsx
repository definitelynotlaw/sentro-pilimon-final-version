'use client'

import { useState, useMemo } from 'react'
import { FilterBar } from './FilterBar'
import { BulletinGrid } from './BulletinGrid'
import { CardSkeleton } from '@/components/shared/LoadingSkeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { Megaphone } from 'lucide-react'
import type { EventCategory } from '@/types/database'

export interface AnnouncementCardData {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  venue?: string | null
  posterUrl?: string | null
  category?: {
    name: string
    slug: string
    color: string
  } | null
  organization?: {
    name: string
    logoUrl?: string | null
  } | null
  goingCount: number
  interestedCount: number
  status?: 'draft' | 'pending' | 'approved' | 'published' | 'archived'
}

interface BulletinFeedProps {
  announcements: AnnouncementCardData[]
  categories: EventCategory[]
  isLoading?: boolean
}

export function BulletinFeed({ announcements, categories, isLoading }: BulletinFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredAnnouncements = useMemo(() => {
    if (!selectedCategory) return announcements
    return announcements.filter(a => a.category?.slug === selectedCategory)
  }, [announcements, selectedCategory])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-plm-gray-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <FilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      {filteredAnnouncements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title={selectedCategory ? `No ${selectedCategory} announcements` : 'No announcements yet'}
          description={selectedCategory ? `No announcements found in the ${selectedCategory} category.` : 'Check back later for upcoming events and announcements from PLMun.'}
        />
      ) : (
        <BulletinGrid announcements={filteredAnnouncements} />
      )}
    </div>
  )
}
