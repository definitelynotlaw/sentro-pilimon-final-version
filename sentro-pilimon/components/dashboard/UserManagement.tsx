'use client'

import { useState, useEffect } from 'react'
import { Shield, UserX, UserCheck, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface User {
  id: string
  email: string
  full_name: string
  role: string
  status: string
  created_at: string
}

export function UserManagement() {
  const supabase = createClient()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'student' | 'officer' | 'moderator' | 'admin'>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      let query = supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      if (filter !== 'all') query = query.eq('role', filter)
      const { data } = await query
      if (data) setUsers(data)
      setIsLoading(false)
    }
    fetchUsers()
  }, [filter])

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    await supabase.from('users').update({ status: newStatus }).eq('id', userId)
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u))
  }

  const updateRole = async (userId: string, newRole: string) => {
    await supabase.from('users').update({ role: newRole }).eq('id', userId)
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
  }

  const deleteUser = async (userId: string) => {
    setDeletingId(userId)
    try {
      const res = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId))
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete user')
      }
    } catch {
      alert('An unexpected error occurred')
    } finally {
      setDeletingId(null)
      setConfirmId(null)
    }
  }

  const roleColors: Record<string, string> = {
    student: '#1E3A5F',
    officer: '#1A6B3C',
    office_staff: '#7B3F00',
    moderator: '#4A1A7A',
    admin: '#6B0000',
  }

  return (
    <div className="space-y-4">
      {/* Confirm Delete Modal */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" style={{ border: '1px solid #EBEBEA' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FEF2F2' }}>
              <Trash2 className="h-6 w-6" style={{ color: '#9B1C1C' }} />
            </div>
            <h2 className="text-lg font-bold text-center mb-2" style={{ color: '#1A1A18' }}>Delete User?</h2>
            <p className="text-sm text-center mb-6" style={{ color: '#5A5A56' }}>
              This will permanently delete <strong>{users.find(u => u.id === confirmId)?.full_name}</strong> and all their data. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 py-2.5 rounded-lg font-medium text-sm"
                style={{ border: '1px solid #D4D4CF', color: '#5A5A56' }}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteUser(confirmId)}
                disabled={deletingId === confirmId}
                className="flex-1 py-2.5 rounded-lg font-medium text-sm text-white"
                style={{ backgroundColor: '#9B1C1C', opacity: deletingId === confirmId ? 0.5 : 1 }}
              >
                {deletingId === confirmId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'student', 'officer', 'moderator', 'admin'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
            style={{
              backgroundColor: filter === f ? '#6B0000' : '#F5F5F3',
              color: filter === f ? 'white' : '#5A5A56',
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* User List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8">
          <p style={{ color: '#5A5A56' }}>No users found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {users.map(user => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white"
              style={{ border: '1px solid #EBEBEA' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: roleColors[user.role] || '#9A9A95' }}
                >
                  {user.full_name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-medium" style={{ color: '#1A1A18' }}>{user.full_name}</p>
                  <p className="text-xs" style={{ color: '#9A9A95' }}>{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={user.role}
                  onChange={(e) => updateRole(user.id, e.target.value)}
                  className="px-2 py-1 text-xs font-medium rounded-lg"
                  style={{
                    backgroundColor: `${roleColors[user.role]}20`,
                    color: roleColors[user.role],
                    border: 'none',
                  }}
                >
                  <option value="student">Student</option>
                  <option value="officer">Officer</option>
                  <option value="office_staff">Office Staff</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>

                <button
                  onClick={() => toggleUserStatus(user.id, user.status)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ backgroundColor: user.status === 'active' ? '#F0FDF4' : '#FEF2F2' }}
                  title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                >
                  {user.status === 'active' ? (
                    <UserCheck className="h-4 w-4" style={{ color: '#1A6B3C' }} />
                  ) : (
                    <UserX className="h-4 w-4" style={{ color: '#9B1C1C' }} />
                  )}
                </button>

                <button
                  onClick={() => setConfirmId(user.id)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ backgroundColor: '#FEF2F2' }}
                  title="Delete user"
                >
                  <Trash2 className="h-4 w-4" style={{ color: '#9B1C1C' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
