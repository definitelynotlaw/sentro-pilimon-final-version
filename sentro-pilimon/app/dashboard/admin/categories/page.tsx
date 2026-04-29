import { redirect } from 'next/navigation'
import { Grid3X3 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { BottomTabBar } from '@/components/navigation/BottomTabBar'
import { TopNavBar } from '@/components/navigation/TopNavBar'
import { CategoryManagement } from '@/components/dashboard/CategoryManagement'

export default async function AdminCategoriesPage() {
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

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <TopNavBar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#6B0000' }}
          >
            <Grid3X3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: '#1A1A18', fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Categories
            </h1>
            <p className="text-sm" style={{ color: '#5A5A56' }}>
              Manage event categories
            </p>
          </div>
        </div>

        <CategoryManagement />
      </div>

      <BottomTabBar />
    </main>
  )
}