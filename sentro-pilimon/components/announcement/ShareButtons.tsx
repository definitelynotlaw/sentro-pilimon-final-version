'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ShareButtonsProps {
  announcementId: string
}

export function ShareButtons({ announcementId }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    const url = `${window.location.origin}/announcement/${announcementId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleCopyLink}
        className="text-xs px-2 py-1 rounded transition-colors"
        style={{ backgroundColor: '#6B0000', color: 'white' }}
      >
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
      <a
        href={`/api/qr/generate?announcementId=${announcementId}`}
        download={`sentro-pilimon-qr-${announcementId}.png`}
        className="text-xs px-2 py-1 rounded transition-colors"
        style={{ backgroundColor: '#F5F5F3', color: '#5A5A56' }}
      >
        Download QR
      </a>
    </div>
  )
}
