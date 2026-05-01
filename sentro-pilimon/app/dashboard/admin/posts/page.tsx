'use client'
import { useState, useEffect } from 'react'
import { TopNavBar } from '@/components/navigation/TopNavBar'
import { BottomTabBar } from '@/components/navigation/BottomTabBar'
import { createClient } from '@/lib/supabase/client'
import { Trash2, ArrowLeft, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

interface Announcement {
  id: string
  title: string
  status: string
  created_at: string
}

export default function ManagePostsPage() {
  const supabase = createClient()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { fetchAnnouncements() }, [])

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('id, title, status, created_at')
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) { console.error('fetch error:', error); setError(error.message) }
      if (data) setAnnouncements(data)
    } catch (e) {
      console.error('fetch exception:', e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    setError(null)
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const json = await res.json()
      if (res.ok) {
        setAnnouncements(prev => prev.filter(a => a.id !== id))
      } else {
        setError('Delete failed: ' + (json.error || res.status))
      }
    } catch (e) {
      setError('Delete error: ' + e)
    } finally {
      setDeletingId(null)
      setConfirmId(null)
    }
  }

  const statusColor: Record<string, string> = {
    published: '#1A6B3C', pending: '#C9972C', draft: '#9A9A95', archived: '#5A5A56',
  }

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <TopNavBar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard/admin" className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" style={{ color: '#5A5A56' }} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1A1A18', fontFamily: 'Playfair Display, Georgia, serif' }}>Manage Posts</h1>
            <p className="text-sm" style={{ color: '#5A5A56' }}>Delete any announcement as admin</p>
          </div>
        </div>
        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: '#FEE2E2', color: '#9B1C1C' }}>
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="p-4 rounded-xl bg-white animate-pulse" style={{ border: '1px solid #EBEBEA' }}>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <p className="text-center py-12" style={{ color: '#9A9A95' }}>No announcements found.</p>
        ) : (
          <div className="space-y-3">
            {announcements.map(ann => (
              <div key={ann.id} className="p-4 rounded-xl bg-white" style={{ border: '1px solid #EBEBEA' }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full capitalize" style={{ backgroundColor: (statusColor[ann.status] || '#5A5A56') + '20', color: statusColor[ann.status] || '#5A5A56' }}>
                        {ann.status}
                      </span>
                    </div>
                    <p className="font-semibold truncate" style={{ color: '#1A1A18' }}>{ann.title}</p>
                    <p className="text-xs mt-1" style={{ color: '#9A9A95' }}>
                      {format(new Date(ann.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  {confirmId === ann.id ? (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs" style={{ color: '#9B1C1C' }}>Delete?</span>
                      <button onClick={() => handleDelete(ann.id)} disabled={deletingId === ann.id} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: '#9B1C1C' }}>
                        {deletingId === ann.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Yes'}
                      </button>
                      <button onClick={() => setConfirmId(null)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: '#F5F5F3', color: '#5A5A56' }}>No</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmId(ann.id)} className="p-2 rounded-lg flex-shrink-0 hover:bg-red-50 transition-colors">
                      <Trash2 className="h-4 w-4" style={{ color: '#9B1C1C' }} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomTabBar />
    </main>
  )
}