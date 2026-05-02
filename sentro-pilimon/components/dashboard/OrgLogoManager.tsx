'use client'

import { useState } from 'react'
import { Upload, Check, X } from 'lucide-react'
import { uploadOrgLogo, updateOrgLogoUrl } from '@/lib/supabase/storage'

interface Org {
  id: string
  name: string
  slug: string
  logo_url: string | null
  accent_color: string
}

export function OrgLogoManager({ orgs }: { orgs: Org[] }) {
  const [logos, setLogos] = useState<Record<string, string | null>>(
    Object.fromEntries(orgs.map(o => [o.id, o.logo_url]))
  )
  const [uploading, setUploading] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (org: Org, file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      setError('Only JPG, PNG, WEBP, or SVG allowed')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('File must be under 2MB')
      return
    }

    setUploading(org.id)
    setError(null)
    setSuccess(null)
    try {
      const url = await uploadOrgLogo(org.id, file)
      await updateOrgLogoUrl(org.id, url)
      setLogos(prev => ({ ...prev, [org.id]: url }))
      setSuccess(org.id)
      setTimeout(() => setSuccess(null), 3000)
    } catch (e: any) {
      setError(e.message || 'Upload failed')
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#FEF2F2', color: '#9B1C1C' }}>
          {error}
        </div>
      )}
      {orgs.map(org => (
        <div key={org.id} className="flex items-center gap-4 p-4 rounded-xl bg-white" style={{ border: '1px solid #EBEBEA' }}>
          <div
            className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold overflow-hidden"
            style={{ backgroundColor: org.accent_color || '#6B0000' }}
          >
            {logos[org.id] ? (
              <img src={logos[org.id]!} alt={org.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm">{org.name.slice(0, 2)}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium truncate" style={{ color: '#1A1A18' }}>{org.name}</p>
            <p className="text-xs truncate" style={{ color: '#9A9A95' }}>
              {logos[org.id] ? 'Logo uploaded' : 'No logo yet'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {success === org.id && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EDF7F0' }}>
                <Check className="h-4 w-4" style={{ color: '#1A6B3C' }} />
              </div>
            )}
            <label className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
              style={{ backgroundColor: uploading === org.id ? '#F5F5F3' : '#6B0000', color: uploading === org.id ? '#9A9A95' : 'white' }}>
              <Upload className="h-4 w-4" />
              {uploading === org.id ? 'Uploading...' : logos[org.id] ? 'Replace' : 'Upload'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                className="hidden"
                disabled={uploading === org.id}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleUpload(org, file)
                  e.target.value = ''
                }}
              />
            </label>
          </div>
        </div>
      ))}

      {orgs.length === 0 && (
        <div className="text-center py-12" style={{ color: '#9A9A95' }}>
          <p>No organizations found in database.</p>
          <p className="text-sm mt-1">Add organizations to Supabase first.</p>
        </div>
      )}
    </div>
  )
}
