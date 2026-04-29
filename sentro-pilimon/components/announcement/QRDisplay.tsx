'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Download, Copy, Check, QrCode } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QRDisplayProps {
  announcementId: string
  className?: string
}

export function QRDisplay({ announcementId, className }: QRDisplayProps) {
  const [copied, setCopied] = useState(false)

  const qrUrl = `/api/qr/generate?announcementId=${announcementId}`
  const targetUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/announcement/${announcementId}`

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(targetUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = async () => {
    const link = document.createElement('a')
    link.href = qrUrl
    link.download = `sentro-pilimon-qr-${announcementId}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <h3 className="font-display text-lg font-semibold text-plm-gray-900 mb-4">
        Share this Event
      </h3>

      <div className="relative p-4 bg-white rounded-xl border-2 border-plm-gold shadow-sm">
        {/* QR Code Image */}
        <div className="relative w-48 h-48">
          <img
            src={qrUrl}
            alt="Event QR Code"
            className="w-full h-full object-contain"
          />
        </div>

        {/* PLMun branding */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-plm-maroon text-white text-[10px] px-3 py-1 rounded-full">
          Sentro Pilimon
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleDownload}
          className={cn(
            'flex items-center gap-2 px-4 py-2 bg-plm-maroon text-white rounded-lg',
            'hover:bg-plm-maroon-dark transition-colors text-sm font-medium'
          )}
        >
          <Download className="h-4 w-4" />
          Download QR
        </button>

        <button
          onClick={handleCopyLink}
          className={cn(
            'flex items-center gap-2 px-4 py-2 border border-plm-gray-200 rounded-lg',
            'hover:bg-plm-gray-50 transition-colors text-sm font-medium',
            copied ? 'text-plm-success' : 'text-plm-gray-700'
          )}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Link
            </>
          )}
        </button>
      </div>

      <p className="mt-4 text-xs text-plm-gray-500 text-center">
        Scan this QR code to quickly access this event
      </p>
    </div>
  )
}