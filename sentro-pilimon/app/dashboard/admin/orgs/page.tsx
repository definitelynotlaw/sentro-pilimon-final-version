import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BottomTabBar } from '@/components/navigation/BottomTabBar'
import { TopNavBar } from '@/components/navigation/TopNavBar'
import { OrgLogoManager } from '@/components/dashboard/OrgLogoManager'
import { ImageIcon } from 'lucide-react'

export default async function AdminOrgsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: orgs } = await supabase
    .from('organizations')
    .select('id, name, slug, logo_url, accent_color')
    .order('name')

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <TopNavBar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6B0000' }}>
            <ImageIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1A1A18', fontFamily: "'Playfair Display', Georgia, serif" }}>
              Org Logos
            </h1>
            <p className="text-sm" style={{ color: '#5A5A56' }}>Upload logos for organizations and departments</p>
          </div>
        </div>
        <OrgLogoManager orgs={orgs || []} />
      </div>
      <BottomTabBar />
    </main>
  )
}
