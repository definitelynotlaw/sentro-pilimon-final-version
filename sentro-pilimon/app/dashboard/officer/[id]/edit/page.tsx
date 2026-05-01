import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { BottomTabBar } from '@/components/navigation/BottomTabBar'
import { TopNavBar } from '@/components/navigation/TopNavBar'
import { AnnouncementForm } from '@/components/dashboard/AnnouncementForm'
import { allOrganizations } from '@/data/organizations'

interface Category {
  id: string
  name: string
  slug: string
  color: string
}

interface Organization {
  id: string
  name: string
  slug: string
}

async function getFormData(announcementId: string) {
  const supabase = await createClient()

  const { data: announcement } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', announcementId)
    .single()

  if (!announcement) return null

  const { data: categories } = await supabase
    .from('event_categories')
    .select('id, name, slug, color')
    .order('sort_order')

  const { data: dbOrganizations } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('status', 'active')
    .order('name')

  const { data: offices } = await supabase
    .from('offices')
    .select('id, name, slug')
    .eq('status', 'active')
    .order('name')

  // Combine static orgs + database orgs + offices, deduped by id
  const allOrgs: Organization[] = [
    ...allOrganizations, // Static data: student councils, dept orgs, university orgs, service offices
    ...(dbOrganizations || []).filter(o => !allOrganizations.some(ao => ao.id === o.id)), // DB orgs not in static
    ...(offices || []).filter(o => !allOrganizations.some(ao => ao.id === o.id)).map(o => ({ id: o.id, name: o.name, slug: o.slug })), // Offices not in static
  ].sort((a, b) => a.name.localeCompare(b.name))

  return {
    announcement,
    categories: (categories || []) as Category[],
    organizations: allOrgs,
  }
}

async function updateAnnouncement(id: string, formData: any) {
  'use server'
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('announcements')
    .update({
      title: formData.title,
      description: formData.description,
      category_id: formData.category_id,
      start_datetime: formData.start_datetime,
      end_datetime: formData.end_datetime,
      venue: formData.venue || null,
      poster_url: formData.poster_url || null,
      poster_crop_x: formData.poster_crop_x || 0,
      poster_crop_y: formData.poster_crop_y || 0,
      poster_zoom: formData.poster_zoom || 1,
      org_id: formData.org_id || null,
    })
    .eq('id', id)
    .eq('publisher_user_id', user.id)

  if (error) {
    console.error('Update error:', error)
    return { success: false, error: 'Failed to update' }
  }

  return { success: true }
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditAnnouncementPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const data = await getFormData(id)
  if (!data) notFound()

  // Prevent editing published announcements
  if (data.announcement.status === 'published') {
    redirect('/dashboard/officer')
  }
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const officerRoles = ['officer', 'office_staff', 'admin']
  if (!profile?.role || !officerRoles.includes(profile.role)) {
    redirect('/dashboard')
  }

  const initialData = {
    id: id,
    title: data.announcement.title,
    description: data.announcement.description,
    category_id: data.announcement.category_id,
    start_datetime: data.announcement.start_datetime.slice(0, 16),
    end_datetime: data.announcement.end_datetime.slice(0, 16),
    venue: data.announcement.venue || undefined,
    poster_url: data.announcement.poster_url || undefined,
    poster_crop_x: data.announcement.poster_crop_x,
    poster_crop_y: data.announcement.poster_crop_y,
    poster_zoom: data.announcement.poster_zoom,
    org_id: data.announcement.org_id || undefined,
  }

  return (
    <main className="min-h-screen pb-24 md:pb-0">
      <TopNavBar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/dashboard/officer"
          className="inline-flex items-center gap-2 mb-6 text-sm"
          style={{ color: '#5A5A56' }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Announcements
        </Link>

        <h1
          className="text-2xl font-bold mb-6"
          style={{ color: '#1A1A18', fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Edit Announcement
        </h1>

        <div
          className="bg-white rounded-xl p-6"
          style={{ border: '1px solid #EBEBEA' }}
        >
          <AnnouncementForm
            categories={data.categories}
            organizations={data.organizations}
            initialData={initialData}
          />
        </div>
      </div>

      <BottomTabBar />
    </main>
  )
}