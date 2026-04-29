import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { BottomTabBar } from '@/components/navigation/BottomTabBar'
import { TopNavBar } from '@/components/navigation/TopNavBar'
import { AnnouncementForm } from '@/components/dashboard/AnnouncementForm'

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

async function getFormData() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('event_categories')
    .select('id, name, slug, color')
    .order('sort_order')

  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('status', 'active')
    .order('name')

  const { data: offices } = await supabase
    .from('offices')
    .select('id, name, slug')
    .eq('status', 'active')
    .order('name')

  const allOrgs = [
    ...(organizations || []).map(o => ({ id: o.id, name: o.name, slug: o.slug })),
    ...(offices || []).map(o => ({ id: o.id, name: o.name, slug: o.slug })),
  ]

  return {
    categories: (categories || []) as Category[],
    organizations: allOrgs as Organization[],
  }
}

async function createAnnouncement(formData: any) {
  'use server'
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // Determine if this is an org or office
  let finalOrgId: string | null = null
  let finalOfficeId: string | null = null

  if (formData.org_id) {
    // Check if it's an organization
    const { data: orgCheck } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', formData.org_id)
      .single()

    if (orgCheck) {
      finalOrgId = formData.org_id
    } else {
      // Check if it's an office
      const { data: officeCheck } = await supabase
        .from('offices')
        .select('id')
        .eq('id', formData.org_id)
        .single()

      if (officeCheck) {
        finalOfficeId = formData.org_id
      }
    }
  }

  const insertData = {
    title: formData.title,
    description: formData.description,
    category_id: formData.category_id,
    start_datetime: formData.start_datetime,
    end_datetime: formData.end_datetime,
    venue: formData.venue || null,
    poster_url: formData.poster_url || null,
    publisher_user_id: user.id,
    org_id: finalOrgId,
    office_id: finalOfficeId,
    status: 'draft',
  }

  const { data, error } = await supabase
    .from('announcements')
    .insert(insertData)
    .select()

  if (error) {
    console.error('Create error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export default async function CreateAnnouncementPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
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

  const { categories, organizations } = await getFormData()

  return (
    <main className="min-h-screen pb-24 md:pb-0">
      <TopNavBar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back */}
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
          Create Announcement
        </h1>

        <div
          className="bg-white rounded-xl p-6"
          style={{ border: '1px solid #EBEBEA' }}
        >
          <AnnouncementForm
            categories={categories}
            organizations={organizations}
            onSubmit={createAnnouncement}
          />
        </div>
      </div>

      <BottomTabBar />
    </main>
  )
}