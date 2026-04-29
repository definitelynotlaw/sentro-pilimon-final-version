'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, X, Link } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ScanPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isSupported, setIsSupported] = useState(true)
  const [manualUrl, setManualUrl] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // Check camera support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false)
    }
  }, [])

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Extract announcement ID from URL
    const url = manualUrl.trim()
    const match = url.match(/announcement\/([a-f0-9-]+)/i)
    if (match) {
      router.push(`/announcement/${match[1]}`)
    } else {
      setError('Invalid announcement URL')
    }
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#1A1A18' }}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white">Scan QR Code</h1>
          <button onClick={() => router.back()} className="p-2">
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Camera Viewfinder */}
        <div
          className="relative w-full aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden mb-6"
          style={{ backgroundColor: '#2C2C2A' }}
        >
          {isSupported ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-sm opacity-70">Camera not available in demo</p>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white p-6">
                <X className="h-16 w-16 mx-auto mb-4" style={{ color: '#9B1C1C' }} />
                <p className="text-lg font-semibold mb-2">Camera Not Supported</p>
                <p className="text-sm opacity-70">Use manual URL entry below</p>
              </div>
            </div>
          )}

          {/* QR Frame Overlay */}
          <div
            className="absolute inset-0 border-4 border-transparent"
            style={{
              borderImage: 'linear-gradient(45deg, #C9972C 0%, #C9972C 100%) 1',
              margin: '40px',
              borderRadius: '20px',
            }}
          >
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 rounded-tl-xl" style={{ borderColor: '#C9972C' }} />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 rounded-tr-xl" style={{ borderColor: '#C9972C' }} />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 rounded-bl-xl" style={{ borderColor: '#C9972C' }} />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 rounded-br-xl" style={{ borderColor: '#C9972C' }} />
          </div>
        </div>

        {/* Instruction */}
        <p className="text-center text-sm mb-6" style={{ color: '#9A9A95' }}>
          Point camera at a Sentro Pilimon QR code
        </p>

        {/* Manual URL Entry */}
        <div className="max-w-sm mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-px" style={{ backgroundColor: '#3C3C3A' }} />
            <span className="text-xs" style={{ color: '#9A9A95' }}>OR</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#3C3C3A' }} />
          </div>

          <form onSubmit={handleManualSubmit}>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#9A9A95' }} />
                <input
                  type="url"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="Paste announcement URL"
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-sm"
                  style={{
                    backgroundColor: '#2C2C2A',
                    color: 'white',
                    border: '1px solid #3C3C3A',
                    outline: 'none',
                  }}
                />
              </div>
              <button
                type="submit"
                className="px-4 py-3 rounded-lg font-medium"
                style={{ backgroundColor: '#6B0000', color: 'white' }}
              >
                Go
              </button>
            </div>
            {error && (
              <p className="text-xs mt-2 text-center" style={{ color: '#9B1C1C' }}>{error}</p>
            )}
          </form>
        </div>
      </div>
    </main>
  )
}