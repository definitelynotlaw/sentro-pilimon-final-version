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

  const allOrgs: Organization[] = [
    ...(dbOrganizations || []),
    ...(offices || [])
      .filter(o => !(dbOrganizations || []).some(d => d.slug === o.slug))
      .map(o => ({ id: o.id, name: o.name, slug: o.slug})),
  ].sort((a, b) => a.name.localeCompare(b.name))

  return {
    categories: (categories || []) as Category[],
    organizations: allOrgs,
  }
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

  const officerRoles = ['officer', 'office_staff', 'admin', 'moderator']
  if (!profile?.role || !officerRoles.includes(profile.role)) {
    redirect('/dashboard')
  }

  const { categories, organizations } = await getFormData()

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
          Create Announcement
        </h1>
        <div
          className="bg-white rounded-xl p-6"
          style={{ border: '1px solid #EBEBEA' }}
        >
          <AnnouncementForm
            categories={categories}
            organizations={organizations}
          />
        </div>
      </div>
      <BottomTabBar />
    </main>
  )
}
