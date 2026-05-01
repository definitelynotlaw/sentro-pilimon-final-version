'use client'

import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import type { EventCategory } from '@/types/database'

interface FilterBarProps {
  categories: EventCategory[]
  selectedCategory: string | null
  onCategoryChange: (slug: string | null) => void
  className?: string
}

export function FilterBar({ categories, selectedCategory, onCategoryChange, className }: FilterBarProps) {
  const selectedCat = categories.find(c => c.slug === selectedCategory)

  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      {/* Mobile: native select dropdown */}
      <div className="md:hidden flex-1">
        <div className="relative">
          <select
            value={selectedCategory || ''}
            onChange={(e) => onCategoryChange(e.target.value || null)}
            className="w-full appearance-none px-4 py-2 pr-10 rounded-lg text-sm font-medium border-2 bg-white"
            style={{
              borderColor: selectedCategory ? (selectedCat?.color || '#6B0000') : '#D4D4CF',
              color: selectedCategory ? (selectedCat?.color || '#6B0000') : '#5A5A56',
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
            style={{ color: '#5A5A56' }}
          />
        </div>
      </div>

      {/* Desktop: horizontal pill row */}
      <div
        className="hidden md:flex items-center gap-2 overflow-x-auto pb-2"
        role="tablist"
        aria-label="Filter announcements by category"
      >
        {/* All filter */}
        <button
          onClick={() => onCategoryChange(null)}
          role="tab"
          aria-selected={selectedCategory === null}
          className={cn(
            'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border-2',
            selectedCategory === null
              ? 'text-white'
              : 'text-gray-600 border-gray-200 hover:border-amber-500'
          )}
          style={{
            backgroundColor: selectedCategory === null ? '#6B0000' : '#FFFFFF',
            borderColor: selectedCategory === null ? '#6B0000' : '#D4D4CF',
          }}
        >
          All
        </button>

        {/* Category filters */}
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.slug)}
            role="tab"
            aria-selected={selectedCategory === cat.slug}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border-2"
            style={{
              backgroundColor: selectedCategory === cat.slug ? cat.color : '#FFFFFF',
              borderColor: selectedCategory === cat.slug ? cat.color : '#D4D4CF',
              color: selectedCategory === cat.slug ? '#FFFFFF' : '#5A5A56',
            }}
          >
            {cat.name}
            <ChevronDown className="h-3 w-3 inline ml-1" />
          </button>
        ))}
      </div>
    </div>
  )
}