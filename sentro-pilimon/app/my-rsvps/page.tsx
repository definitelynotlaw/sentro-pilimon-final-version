'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Calendar, MapPin, CheckCircle, Clock, XCircle } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { BottomTabBar } from '@/components/navigation/BottomTabBar'
import { TopNavBar } from '@/components/navigation/TopNavBar'

interface RSVPItem {
  id: string
  rsvp_status: 'interested' | 'going' | 'attended' | 'cancelled'
  check_in_time: string | null
  announcement: {
    id: string
    title: string
    start_datetime: string
    venue: string | null
    poster_url: string | null
  } | null
}

const statusConfig = {
  interested: { label: 'Interested', bg: '#C9972C', color: 'white', icon: Clock },
  going: { label: 'Going', bg: '#1A6B3C', color: 'white', icon: CheckCircle },
  attended: { label: 'Attended', bg: '#1E3A5F', color: 'white', icon: CheckCircle },
  cancelled: { label: 'Cancelled', bg: '#9A9A95', color: 'white', icon: XCircle },
}

export default function MyRSVPsPage() {
  const supabase = createClient()
  const [rsvps, setRsvps] = useState<RSVPItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'going' | 'interested'>('all')

  useEffect(() => {
    const fetchRSVPs = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('rsvp_records')
        .select(`
          id,
          rsvp_status,
          check_in_time,
          announcement:announcements(
            id,
            title,
            start_datetime,
            venue,
            poster_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) {
        setRsvps(data.map(d => ({
          ...d,
          announcement: d.announcement ? (Array.isArray(d.announcement) ? d.announcement[0] : d.announcement) : null,
        })))
      }
      setIsLoading(false)
    }

    fetchRSVPs()
  }, [supabase])

  const filteredRsvps = rsvps.filter(r => {
    if (filter === 'all') return r.rsvp_status !== 'cancelled'
    return r.rsvp_status === filter
  })

  if (isLoading) {
    return (
      <main className="min-h-screen pb-20 md:pb-0">
        <TopNavBar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 rounded-xl bg-white animate-pulse" style={{ border: '1px solid #EBEBEA' }}>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
        <BottomTabBar />
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <TopNavBar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: '#1A1A18', fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          My RSVPs
        </h1>
        <p className="mb-6" style={{ color: '#5A5A56' }}>
          {rsvps.length} total RSVP{rsvps.length !== 1 ? 's' : ''}
        </p>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'going', 'interested'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: filter === f ? '#6B0000' : '#F5F5F3',
                color: filter === f ? 'white' : '#5A5A56',
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {filteredRsvps.length === 0 ? (
          <div className="text-center py-12">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: '#F5ECEC' }}
            >
              <Calendar className="w-8 h-8" style={{ color: '#6B0000' }} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#1A1A18' }}>
              No RSVPs yet
            </h3>
            <p className="text-sm mb-6" style={{ color: '#5A5A56' }}>
              Browse announcements and RSVP to upcoming events.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg"
              style={{ backgroundColor: '#6B0000' }}
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRsvps.map(rsvp => {
              const config = statusConfig[rsvp.rsvp_status]
              const EventIcon = config.icon

              return (
                <Link
                  key={rsvp.id}
                  href={rsvp.announcement ? `/announcement/${rsvp.announcement.id}` : '/'}
                  className="block p-4 rounded-xl bg-white hover:shadow-md transition-shadow"
                  style={{ border: '1px solid #EBEBEA' }}
                >
                  {rsvp.announcement ? (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <span
                          className="px-2 py-0.5 text-xs font-semibold rounded-full flex items-center gap-1"
                          style={{ backgroundColor: config.bg, color: config.color }}
                        >
                          <EventIcon className="h-3 w-3" />
                          {config.label}
                        </span>
                        {rsvp.check_in_time && (
                          <span className="text-xs" style={{ color: '#1A6B3C' }}>
                            ✓ Checked in
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold mb-2" style={{ color: '#1A1A18' }}>
                        {rsvp.announcement.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm" style={{ color: '#9A9A95' }}>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(rsvp.announcement.start_datetime), 'MMM d, yyyy • h:mm a')}
                        </span>
                        {rsvp.announcement.venue && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {rsvp.announcement.venue}
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <p style={{ color: '#9A9A95' }}>Announcement no longer available</p>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <BottomTabBar />
    </main>
  )
}