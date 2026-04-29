'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Plus, Calendar, MapPin, MoreVertical, Edit, Trash2, Eye, QrCode } from 'lucide-react'
import { StatusBadge } from '@/components/bulletin/StatusBadge'
import { createClient } from '@/lib/supabase/client'

interface Announcement {
  id: string
  title: string
  start_datetime: string
  venue: string | null
  status: 'draft' | 'pending' | 'approved' | 'published' | 'archived'
  view_count: number
  category: { name: string; color: string }
}

interface AnnouncementListProps {
  userId: string
  onDelete?: (id: string) => void
}

export function AnnouncementList({ userId, onDelete }: AnnouncementListProps) {
  const supabase = createClient()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data } = await supabase
        .from('announcements')
        .select('id, title, start_datetime, venue, status, view_count, category:event_categories(name, color)')
        .eq('publisher_user_id', userId)
        .order('created_at', { ascending: false })

      if (data) {
        setAnnouncements(data.map(d => ({
          ...d,
          category: Array.isArray(d.category) ? d.category[0] : d.category,
        })))
      }
      setIsLoading(false)
    }

    fetchAnnouncements()
  }, [userId])

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      await supabase.from('announcements').delete().eq('id', id)
      setAnnouncements(announcements.filter(a => a.id !== id))
      onDelete?.(id)
    }
  }

  const handleSubmitForReview = async (id: string) => {
    const { error } = await supabase
      .from('announcements')
      .update({ status: 'pending', updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('status', 'draft')

    if (!error) {
      setAnnouncements(announcements.map(a =>
        a.id === id ? { ...a, status: 'pending' } : a
      ))
      alert('Announcement submitted for review!')
    } else {
      alert('Failed to submit for review')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
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
          <svg className="w-8 h-8" style={{ color: '#6B0000' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: '#1A1A18' }}>
          No announcements yet
        </h3>
        <p className="text-sm mb-6" style={{ color: '#5A5A56' }}>
          Create your first announcement to get started.
        </p>
        <Link
          href="/dashboard/officer/create"
          className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg"
          style={{ backgroundColor: '#6B0000' }}
        >
          <Plus className="h-5 w-5" />
          Create Announcement
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Link
          href="/dashboard/officer/create"
          className="inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg"
          style={{ backgroundColor: '#6B0000' }}
        >
          <Plus className="h-4 w-4" />
          New
        </Link>
      </div>

      {announcements.map((ann) => (
        <div
          key={ann.id}
          className="p-4 rounded-xl bg-white"
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
                <StatusBadge status={ann.status} size="sm" />
              </div>
              <Link href={`/announcement/${ann.id}`} className="block">
                <h3
                  className="text-base font-semibold mb-1 hover:underline"
                  style={{ color: '#1A1A18' }}
                >
                  {ann.title}
                </h3>
              </Link>
              <div className="flex items-center gap-4 text-xs" style={{ color: '#9A9A95' }}>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(ann.start_datetime), 'MMM d, yyyy h:mm a')}
                </span>
                {ann.venue && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {ann.venue}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {ann.view_count} views
                </span>
              </div>
            </div>

            {/* Actions Menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(menuOpen === ann.id ? null : ann.id)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <MoreVertical className="h-4 w-4" style={{ color: '#5A5A56' }} />
              </button>

              {menuOpen === ann.id && (
                <div
                  className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border z-10"
                  style={{ borderColor: '#EBEBEA' }}
                >
                  <Link
                    href={`/announcement/${ann.id}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm w-full hover:bg-gray-50"
                    style={{ color: '#5A5A56' }}
                    onClick={() => setMenuOpen(null)}
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Link>
                  {(ann.status === 'draft' || ann.status === 'pending') && (
                    <>
                      <Link
                        href={`/dashboard/officer/${ann.id}/edit`}
                        className="flex items-center gap-2 px-4 py-2 text-sm w-full hover:bg-gray-50"
                        style={{ color: '#5A5A56' }}
                        onClick={() => setMenuOpen(null)}
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Link>
                      {ann.status === 'draft' && (
                        <button
                          onClick={() => {
                            setMenuOpen(null)
                            handleSubmitForReview(ann.id)
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm w-full hover:bg-gray-50"
                          style={{ color: '#1A6B3C' }}
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Submit for Review
                        </button>
                      )}
                    </>
                  )}
                  <Link
                    href={`/api/qr/generate?announcementId=${ann.id}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm w-full hover:bg-gray-50"
                    style={{ color: '#5A5A56' }}
                    target="_blank"
                    onClick={() => setMenuOpen(null)}
                  >
                    <QrCode className="h-4 w-4" />
                    QR Code
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(null)
                      handleDelete(ann.id)
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm w-full hover:bg-gray-50"
                    style={{ color: '#9B1C1C' }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}