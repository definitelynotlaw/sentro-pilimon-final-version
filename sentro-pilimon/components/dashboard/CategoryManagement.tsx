'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Category {
  id: string
  name: string
  slug: string
  color: string
  icon: string | null
  sort_order: number
  announcement_count?: number
}

const defaultIcons = ['BookOpen', 'Users', 'Building2', 'UserPlus', 'Trophy', 'Music', 'Heart', 'Megaphone']

export function CategoryManagement() {
  const supabase = createClient()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('event_categories')
        .select('*')
        .order('sort_order')

      if (data) setCategories(data)
      setIsLoading(false)
    }

    fetchCategories()
  }, [])

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    await supabase.from('event_categories').update(updates).eq('id', id)
    setCategories(categories.map(c => c.id === id ? { ...c, ...updates } : c))
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        categories.map((cat, index) => (
          <div
            key={cat.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-white"
            style={{ border: '1px solid #EBEBEA' }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: cat.color }}
            >
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="font-medium" style={{ color: '#1A1A18' }}>{cat.name}</p>
              <p className="text-xs" style={{ color: '#9A9A95' }}>{cat.slug}</p>
            </div>
            <input
              type="color"
              value={cat.color}
              onChange={(e) => updateCategory(cat.id, { color: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateCategory(cat.id, { sort_order: Math.max(0, cat.sort_order - 1) })}
                disabled={index === 0}
                className="px-2 py-1 text-xs rounded"
                style={{ backgroundColor: '#F5F5F3', color: '#5A5A56', opacity: index === 0 ? 0.3 : 1 }}
              >
                ↑
              </button>
              <button
                onClick={() => updateCategory(cat.id, { sort_order: cat.sort_order + 1 })}
                disabled={index === categories.length - 1}
                className="px-2 py-1 text-xs rounded"
                style={{ backgroundColor: '#F5F5F3', color: '#5A5A56', opacity: index === categories.length - 1 ? 0.3 : 1 }}
              >
                ↓
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}