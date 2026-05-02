export const dynamic = "force-dynamic"

import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { ArrowLeft, Calendar, MapPin, Users, Building2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ShareButtons } from '@/components/announcement/ShareButtons'
import { QRModal } from '@/components/announcement/QRModal'
import { RSVPButton } from '@/components/announcement/RSVPButton'
import { PLMunLogo } from '@/components/shared/PLMunLogo'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('announcements')
    .select('title, description, poster_url')
    .eq('id', id)
    .single()

  if (!data) return { title: 'Announcement Not Found' }

  return {
    title: `${data.title} | Sentro Pilimon`,
    description: data.description?.slice(0, 160) || '',
  }
}

async function getAnnouncement(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('announcements')
    .select(`
      *,
      category:event_categories(name, color),
      organization:organizations(name),
      office:offices(name),
      publisher:users!announcements_publisher_user_id_fkey(full_name)
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error('Error fetching announcement:', error)
    return null
  }

  return {
    ...data,
    category: Array.isArray(data.category) ? data.category[0] : data.category,
    organization: Array.isArray(data.organization) ? data.organization[0] : data.organization,
    office: Array.isArray(data.office) ? data.office[0] : data.office,
    publisher: Array.isArray(data.publisher) ? data.publisher[0] : data.publisher,
  }
}

async function getRSVPCounts(announcementId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('rsvp_records')
    .select('rsvp_status')
    .eq('announcement_id', announcementId)
    .in('rsvp_status', ['going', 'interested'])

  const going = data?.filter(r => r.rsvp_status === 'going').length || 0
  const interested = data?.filter(r => r.rsvp_status === 'interested').length || 0

  return { going, interested }
}

export default async function AnnouncementPage({ params }: PageProps) {
  const { id } = await params

  const announcement = await getAnnouncement(id)

  if (!announcement) {
    notFound()
  }

  const { going, interested } = await getRSVPCounts(id)

  return (
    <main className="min-h-screen pb-24 md:pb-8" style={{ backgroundColor: '#FAFAF7' }}>
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 transition-colors"
          style={{ color: '#6B0000' }}
        >
          <PLMunLogo size="sm" />
          <span className="font-semibold hidden md:inline">Sentro Pilimon</span>
        </Link>
        <span style={{ color: '#D4D4CF' }}>|</span>
        <Link
          href="/"
          className="inline-flex items-center gap-2 transition-colors"
          style={{ color: '#6B0000' }}
        >
          <ArrowLeft className="h-4 w-4" />
          <span style={{ fontWeight: 500 }}>Back to Bulletin</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #EBEBEA' }}>
          {/* Poster Image */}
          <div className="relative aspect-[16/9] overflow-hidden" style={{ backgroundColor: '#EBEBEA' }}>
            {announcement.poster_url ? (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  transform: `translate(${announcement.poster_crop_x || 0}px, ${announcement.poster_crop_y || 0}px) scale(${announcement.poster_zoom || 1})`,
                  transformOrigin: 'center center',
                }}
              >
                <img
                  src={announcement.poster_url}
                  alt={announcement.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: `${announcement.category?.color || '#6B0000'}20` }}
              >
                <span
                  className="text-8xl font-bold opacity-30"
                  style={{ color: announcement.category?.color || '#6B0000', fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {announcement.title.charAt(0)}
                </span>
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span
                className="px-2 py-1 text-xs font-semibold rounded-full"
                style={{ backgroundColor: announcement.category?.color || '#6B0000', color: 'white' }}
              >
                {announcement.category?.name || 'General'}
              </span>
            </div>
          </div>

          {/* Event Info */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left: Event Details */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-4" style={{ color: '#1A1A18' }}>
                  {announcement.title}
                </h1>

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5" style={{ color: '#C9972C' }} />
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
                      <MapPin className="h-5 w-5" style={{ color: '#C9972C' }} />
                      <p style={{ color: '#1A1A18' }}>{announcement.venue}</p>
                    </div>
                  )}

                  {(announcement.organization || announcement.office) && (
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5" style={{ color: '#C9972C' }} />
                      <p style={{ color: '#1A1A18' }}>
                        {announcement.organization?.name || announcement.office?.name}
                      </p>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5" style={{ color: '#C9972C' }} />
                    <div className="flex gap-4">
                      <span style={{ color: '#1A1A18' }}>{going} Going</span>
                      <span style={{ color: '#5A5A56' }}>{interested} Interested</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: QR Code Section */}
              <div
                className="md:w-48 flex flex-col items-center text-center p-4 rounded-xl"
                style={{ backgroundColor: '#FAFAF7', border: '1px solid #EBEBEA' }}
              >
                <QRModal
                  announcementId={id}
                  qrUrl={`/api/qr/generate?announcementId=${id}`}
                />
                <p className="text-xs font-medium mt-3 mb-3" style={{ color: '#5A5A56' }}>Tap to enlarge</p>
                <ShareButtons announcementId={id} />
              </div>
            </div>

            {/* About this Event - below both columns */}
            <div className="border-t mt-6 pt-4" style={{ borderColor: '#EBEBEA' }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: '#1A1A18' }}>
                About this Event
              </h2>
              <p className="whitespace-pre-wrap mb-4" style={{ color: '#5A5A56', lineHeight: 1.6 }}>
                {announcement.description}
              </p>

              {/* RSVP Section */}
              <div className="border-t pt-4" style={{ borderColor: '#EBEBEA' }}>
                <p className="text-sm font-medium mb-3" style={{ color: '#1A1A18' }}>
                  Want to join this event?
                </p>
                <RSVPButton announcementId={id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}