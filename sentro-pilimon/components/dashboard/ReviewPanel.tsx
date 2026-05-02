'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Calendar, MapPin, User, CheckCircle, XCircle, ArrowLeft, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ReviewPanelProps {
  announcement: {
    id: string
    title: string
    description: string
    start_datetime: string
    end_datetime: string
    venue: string | null
    poster_url: string | null
    publisher: { full_name: string; email: string }
    category: { name: string; color: string }
    organization: { name: string } | null
  }
}

export function ReviewPanel({ announcement }: ReviewPanelProps) {
  const router = useRouter()
  const supabase = createClient()
  const [remarks, setRemarks] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [action, setAction] = useState<'approve' | 'reject' | 'return' | null>(null)

  const handleAction = async (actionType: 'approved' | 'rejected' | 'returned') => {
    setIsSubmitting(true)
    setAction(actionType === 'approved' ? 'approve' : actionType === 'rejected' ? 'reject' : 'return')

    const { data: { user } } = await supabase.auth.getUser()

    // For demo: approved immediately publishes
    // In production, this could be a two-step (approved → published)
    const finalStatus = actionType === 'approved' ? 'published' : actionType === 'rejected' ? 'archived' : 'draft'

    const { error } = await supabase
      .from('announcements')
      .update({
        status: finalStatus,
        moderator_remarks: remarks || null,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
        published_at: actionType === 'approved' ? new Date().toISOString() : null,
      })
      .eq('id', announcement.id)

    if (!error) {
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        announcement_id: announcement.id,
        action_type: actionType.toUpperCase(),
        details: { remarks },
      })
      router.push('/dashboard/moderation')
      router.refresh()
    }

    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="p-4 rounded-xl"
        style={{ backgroundColor: '#F5ECEC' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span
            className="px-2 py-0.5 text-xs font-semibold rounded-full"
            style={{ backgroundColor: announcement.category?.color || '#6B0000', color: 'white' }}
          >
            {announcement.category?.name || 'General'}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#C9972C', color: 'white' }}>
            Pending Review
          </span>
        </div>
        <h1
          className="text-xl font-bold"
          style={{ color: '#1A1A18', fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {announcement.title}
        </h1>
      </div>

      {/* Event Details */}
      <div
        className="p-4 rounded-xl bg-white"
        style={{ border: '1px solid #EBEBEA' }}
      >
        <h2 className="text-sm font-semibold mb-3" style={{ color: '#5A5A56' }}>
          Event Details
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 mt-0.5" style={{ color: '#C9972C' }} />
            <div>
              <p style={{ color: '#1A1A18' }}>
                {format(new Date(announcement.start_datetime), 'EEEE, MMMM d, yyyy')}
              </p>
              <p style={{ color: '#5A5A56' }}>
                {format(new Date(announcement.start_datetime), 'h:mm a')} — {format(new Date(announcement.end_datetime), 'h:mm a')}
              </p>
            </div>
          </div>
          {announcement.venue && (
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5" style={{ color: '#C9972C' }} />
              <p style={{ color: '#1A1A18' }}>{announcement.venue}</p>
            </div>
          )}
          <div className="flex items-start gap-3">
            <User className="h-4 w-4 mt-0.5" style={{ color: '#C9972C' }} />
            <div>
              <p style={{ color: '#1A1A18' }}>{announcement.publisher?.full_name ?? 'Unknown'}</p>
              <p style={{ color: '#5A5A56' }}>{announcement.publisher?.email ?? ''}</p>
            </div>
          </div>
          {announcement.organization && (
            <p className="text-xs" style={{ color: '#9A9A95' }}>
              Posted by {announcement.organization.name}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div
        className="p-4 rounded-xl bg-white"
        style={{ border: '1px solid #EBEBEA' }}
      >
        <h2 className="text-sm font-semibold mb-3" style={{ color: '#5A5A56' }}>
          Description
        </h2>
        <p className="text-sm whitespace-pre-wrap" style={{ color: '#1A1A18', lineHeight: 1.6 }}>
          {announcement.description}
        </p>
      </div>

      {/* Remarks */}
      <div
        className="p-4 rounded-xl bg-white"
        style={{ border: '1px solid #EBEBEA' }}
      >
        <h2 className="text-sm font-semibold mb-3" style={{ color: '#5A5A56' }}>
          Moderator Remarks
        </h2>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Add remarks (optional)..."
          rows={3}
          className="w-full px-3 py-2 rounded-lg text-sm"
          style={{
            border: '1px solid #D4D4CF',
            outline: 'none',
            resize: 'none',
          }}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => router.back()}
          className="flex-1 py-3 font-medium rounded-lg flex items-center justify-center gap-2"
          style={{ backgroundColor: '#F5F5F3', color: '#5A5A56' }}
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </button>

        <button
          onClick={() => handleAction('returned')}
          disabled={isSubmitting}
          className="flex-1 py-3 font-medium rounded-lg flex items-center justify-center gap-2"
          style={{ backgroundColor: '#F5F5F3', color: '#5A5A56' }}
        >
          {action === 'return' && <Loader2 className="h-4 w-4 animate-spin" />}
          Return for Revision
        </button>

        <button
          onClick={() => handleAction('rejected')}
          disabled={isSubmitting}
          className="flex-1 py-3 font-medium rounded-lg flex items-center justify-center gap-2"
          style={{ backgroundColor: '#9B1C1C', color: 'white' }}
        >
          {action === 'reject' && <Loader2 className="h-4 w-4 animate-spin" />}
          <XCircle className="h-4 w-4" />
          Reject
        </button>

        <button
          onClick={() => handleAction('approved')}
          disabled={isSubmitting}
          className="flex-1 py-3 font-medium rounded-lg flex items-center justify-center gap-2"
          style={{ backgroundColor: '#1A6B3C', color: 'white' }}
        >
          {action === 'approve' && <Loader2 className="h-4 w-4 animate-spin" />}
          <CheckCircle className="h-4 w-4" />
          Approve
        </button>
      </div>
    </div>
  )
}