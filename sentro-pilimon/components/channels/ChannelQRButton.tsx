'use client'

import { useState, useEffect } from 'react'
import { QrCode, X, Download } from 'lucide-react'

interface ChannelQRButtonProps {
  channelUrl: string
  channelName: string
}

export function ChannelQRButton({ channelUrl, channelName }: ChannelQRButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleOpen = async () => {
    setIsOpen(true)
    if (qrDataUrl) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: channelUrl }),
      })
      const data = await res.json()
      if (data.qrDataUrl) setQrDataUrl(data.qrDataUrl)
    } catch (e) {
      console.error('QR generation failed', e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `sentro-pilimon-${channelName.toLowerCase().replace(/\s+/g, '-')}-qr.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        style={{ backgroundColor: '#F5F5F3', color: '#5A5A56', border: '1px solid #EBEBEA' }}
      >
        <QrCode className="h-4 w-4" />
        QR Code
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative bg-white rounded-2xl p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" style={{ color: '#5A5A56' }} />
            </button>

            <div className="flex flex-col items-center">
              <h3 className="font-bold text-lg mb-1" style={{ color: '#1A1A18' }}>{channelName}</h3>
              <p className="text-xs mb-4 text-center" style={{ color: '#9A9A95' }}>
                Scan to visit this channel
              </p>

              {isLoading ? (
                <div
                  className="w-64 h-64 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#F5F5F3' }}
                >
                  <div className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full" style={{ borderColor: '#6B0000', borderTopColor: 'transparent' }} />
                </div>
              ) : qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-64 h-64 rounded-xl"
                  style={{ border: '4px solid #C9972C' }}
                />
              ) : (
                <div className="w-64 h-64 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF2F2' }}>
                  <p className="text-sm" style={{ color: '#9B1C1C' }}>Failed to generate QR</p>
                </div>
              )}

              {qrDataUrl && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg mt-4 text-sm font-medium transition-colors"
                  style={{ backgroundColor: '#6B0000', color: 'white' }}
                >
                  <Download className="h-4 w-4" />
                  Download QR
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
