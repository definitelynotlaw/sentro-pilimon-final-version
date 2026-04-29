'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { CheckCircle, XCircle, ArrowLeft, Eye } from 'lucide-react'
import { StatusBadge } from '@/components/bulletin/StatusBadge'
import { createClient } from '@/lib/supabase/client'

interface PendingAnnouncement {
  id: string
  title: string
  description: string
  start_datetime: string
  venue: string | null
  created_at: string
  publisher: { full_name: string; email: string }
  category: { name: string; color: string }
  organization: { name: string } | null
}

export function PendingQueue() {
  const supabase = createClient()
  const [announcements, setAnnouncements] = useState<PendingAnnouncement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPending = async () => {
      const { data } = await supabase
        .from('announcements')
        .select(`
          id, title, description, start_datetime, venue, created_at,
          publisher:users!publisher_user_id(full_name, email),
          category:event_categories(name, color),
          organization:organizations(name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true })

      if (data) {
        setAnnouncements(data.map(d => ({
          ...d,
          publisher: Array.isArray(d.publisher) ? d.publisher[0] : d.publisher,
          category: Array.isArray(d.category) ? d.category[0] : d.category,
          organization: d.organization ? (Array.isArray(d.organization) ? d.organization[0] : d.organization) : null,
        })))
      }
      setIsLoading(false)
    }

    fetchPending()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="p-4 rounded-xl bg-white animate-pulse" style={{ border: '1px solid #EBEBEA' }}>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (announcements.length === 0) {
    return (
      <div className="text-center py-12">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: '#F5ECEC' }}
        >
          <CheckCircle className="w-8 h-8" style={{ color: '#1A6B3C' }} />
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: '#1A1A18' }}>
          All caught up!
        </h3>
        <p className="text-sm" style={{ color: '#5A5A56' }}>
          No pending announcements to review.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm mb-4" style={{ color: '#5A5A56' }}>
        {announcements.length} pending review
      </p>

      {announcements.map((ann) => (
        <Link
          key={ann.id}
          href={`/dashboard/moderation/${ann.id}/review`}
          className="block p-4 rounded-xl bg-white hover:shadow-md transition-shadow"
          style={{ border: '1px solid #EBEBEA' }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="px-2 py-0.5 text-xs font-semibold rounded-full"
                  style={{ backgroundColor: ann.category.color, color: 'white' }}
                >
                  {ann.category.name}
                </span>
                <StatusBadge status="pending" size="sm" />
              </div>
              <h3 className="text-base font-semibold mb-1" style={{ color: '#1A1A18' }}>
                {ann.title}
              </h3>
              <p className="text-sm mb-2 line-clamp-2" style={{ color: '#5A5A56' }}>
                {ann.description}
              </p>
              <div className="text-xs" style={{ color: '#9A9A95' }}>
                <span>By {ann.publisher?.full_name ?? 'Unknown'}</span>
                <span className="mx-2">•</span>
                <span>{format(new Date(ann.created_at), 'MMM d, yyyy')}</span>
                {ann.organization && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{ann.organization.name}</span>
                  </>
                )}
              </div>
            </div>
            <Eye className="h-5 w-5 ml-4" style={{ color: '#9A9A95' }} />
          </div>
        </Link>
      ))}
    </div>
  )
}