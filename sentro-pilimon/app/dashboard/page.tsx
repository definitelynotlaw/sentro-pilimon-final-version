import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
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

  const role = profile?.role || 'student'

  // Route to appropriate dashboard based on role
  switch (role) {
    case 'admin':
      redirect('/dashboard/admin')
    case 'moderator':
    case 'officer':
    case 'office_staff':
      redirect('/dashboard/officer')
    case 'student':
    default:
      redirect('/dashboard/student')
  }
}