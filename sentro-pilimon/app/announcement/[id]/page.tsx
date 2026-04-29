import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowLeft, Calendar, MapPin, Users, Building2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
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
      publisher:users(full_name)
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
      <div className="max-w-4xl mx-auto px-4 py-4">
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
        <div className="bg-white rounded-xl p-6" style={{ border: '1px solid #EBEBEA' }}>
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#1A1A18' }}>
            {announcement.title}
          </h1>

          <div className="flex items-center gap-2 mb-4">
            <span
              className="px-2 py-0.5 text-xs font-semibold rounded-full"
              style={{ backgroundColor: announcement.category?.color || '#6B0000', color: 'white' }}
            >
              {announcement.category?.name || 'General'}
            </span>
            <span className="text-xs" style={{ color: '#9A9A95' }}>
              Status: {announcement.status}
            </span>
          </div>

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

          <div className="border-t pt-4" style={{ borderColor: '#EBEBEA' }}>
            <h2 className="text-lg font-semibold mb-3" style={{ color: '#1A1A18' }}>
              About this Event
            </h2>
            <p className="whitespace-pre-wrap" style={{ color: '#5A5A56', lineHeight: 1.6 }}>
              {announcement.description}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}