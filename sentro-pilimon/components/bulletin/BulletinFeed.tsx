'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
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
  const [searchQuery, setSearchQuery] = useState(() => typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('q') || '' : '')

  const filteredAnnouncements = useMemo(() => {
    let result = announcements
    if (selectedCategory) {
      result = result.filter(a => a.category?.slug === selectedCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q) ||
        a.venue?.toLowerCase().includes(q) ||
        a.organization?.name?.toLowerCase().includes(q)
      )
    }
    return result
  }, [announcements, selectedCategory, searchQuery])

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
    <div className="space-y-4">
      {/* Search bar — mobile only (desktop is in TopNavBar) */}
      <div className="md:hidden relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
          style={{ color: '#9A9A95' }}
        />
        <input
          type="search"
          placeholder="Search announcements..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); const p = new URLSearchParams(window.location.search); e.target.value ? p.set('q', e.target.value) : p.delete('q'); window.history.replaceState(null, '', window.location.pathname + (p.toString() ? '?' + p.toString() : '')); window.dispatchEvent(new Event('searchupdate')); }}
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
          style={{
            backgroundColor: '#F5F5F3',
            border: '1px solid #EBEBEA',
            outline: 'none',
            color: '#1A1A18',
          }}
        />
      </div>

      <FilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {filteredAnnouncements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title={searchQuery ? `No results for "${searchQuery}"` : selectedCategory ? `No ${selectedCategory} announcements` : 'No announcements yet'}
          description={searchQuery ? 'Try a different keyword.' : selectedCategory ? `No announcements found in the ${selectedCategory} category.` : 'Check back later for upcoming events and announcements from PLMun.'}
        />
      ) : (
        <BulletinGrid announcements={filteredAnnouncements} />
      )}
    </div>
  )
}
