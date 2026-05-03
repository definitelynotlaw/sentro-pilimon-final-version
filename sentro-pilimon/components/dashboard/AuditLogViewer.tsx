'use client'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Activity } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AuditLog {
  id: string
  user_id: string | null
  announcement_id: string | null
  action_type: string
  action_timestamp: string
  details: Record<string, unknown>
  user?: { full_name: string; email: string }
}

export function AuditLogViewer() {
  const supabase = createClient()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from('audit_logs')
        .select(`
          id, user_id, announcement_id, action_type, action_timestamp, details,
          user:users(full_name, email)
        `)
        .order('action_timestamp', { ascending: false })
        .limit(100)

      if (data) {
        setLogs(data.map(d => ({
          ...d,
          user: d.user ? (Array.isArray(d.user) ? d.user[0] : d.user) : undefined,
        })))
      }
      setIsLoading(false)
    }
    fetchLogs()
  }, [])

  const actionColors: Record<string, string> = {
    CREATE: '#1A6B3C',
    UPDATE: '#1E3A5F',
    DELETE: '#9B1C1C',
    APPROVE: '#1A6B3C',
    REJECT: '#9B1C1C',
    SUBMIT_FOR_APPROVAL: '#C9972C',
    ARCHIVE: '#5A5A56',
    RSVP: '#6B0000',
  }

  return (
    <div>
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12">
          <Activity className="h-12 w-12 mx-auto mb-4" style={{ color: '#9A9A95' }} />
          <p style={{ color: '#5A5A56' }}>No audit logs yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map(log => (
            <div
              key={log.id}
              className="flex items-start gap-4 p-4 rounded-xl bg-white"
              style={{ border: '1px solid #EBEBEA' }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: actionColors[log.action_type] || '#9A9A95' }}
              >
                {log.action_type.slice(0, 2)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span
                    className="px-2 py-0.5 text-xs font-semibold rounded"
                    style={{
                      backgroundColor: `${actionColors[log.action_type]}20`,
                      color: actionColors[log.action_type],
                    }}
                  >
                    {log.action_type.replace('_', ' ')}
                  </span>
                  <span className="text-xs" style={{ color: '#9A9A95' }}>
                    {format(new Date(log.action_timestamp), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                <p className="text-sm mt-1" style={{ color: '#1A1A18' }}>
                  {log.user ? `${log.user.full_name} (${log.user.email})` : 'System'}
                </p>
                {log.announcement_id && (
                  <p className="text-xs mt-1" style={{ color: '#9A9A95' }}>
                    Announcement ID: {log.announcement_id}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}