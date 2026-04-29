'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  color: string
}

interface FilterBarProps {
  categories: Category[]
  className?: string
}

export function FilterBar({ categories, className }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category') || 'all'

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug === 'all') {
      params.delete('category')
    } else {
      params.set('category', slug)
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 overflow-x-auto pb-2',
        className
      )}
      role="tablist"
      aria-label="Filter announcements by category"
    >
      {/* All filter */}
      <button
        onClick={() => handleCategoryChange('all')}
        role="tab"
        aria-selected={activeCategory === 'all'}
        className={cn(
          'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border-2',
          activeCategory === 'all'
            ? 'text-white'
            : 'text-gray-600 border-gray-200 hover:border-amber-500'
        )}
        style={{
          backgroundColor: activeCategory === 'all' ? '#6B0000' : '#FFFFFF',
          borderColor: activeCategory === 'all' ? '#6B0000' : '#D4D4CF',
        }}
      >
        All
      </button>

      {/* Category filters */}
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleCategoryChange(cat.slug)}
          role="tab"
          aria-selected={activeCategory === cat.slug}
          className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border-2 text-white"
          style={{
            backgroundColor: activeCategory === cat.slug ? cat.color : '#FFFFFF',
            borderColor: activeCategory === cat.slug ? cat.color : '#D4D4CF',
            color: activeCategory === cat.slug ? '#FFFFFF' : '#5A5A56',
          }}
        >
          {cat.name}
          <ChevronDown className="h-3 w-3 inline ml-1" />
        </button>
      ))}
    </div>
  )
}