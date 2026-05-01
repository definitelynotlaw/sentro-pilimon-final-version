'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QRModalProps {
  announcementId: string
  qrUrl: string
}

export function QRModal({ announcementId, qrUrl }: QRModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = qrUrl
    link.download = `sentro-pilimon-qr-${announcementId}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(true)}
        className="cursor-pointer hover:opacity-80 transition-opacity"
        role="button"
        aria-label="View larger QR code"
      >
        <img
          src={qrUrl}
          alt="QR Code"
          className="w-32 h-32 md:w-36 md:h-36 rounded-lg"
          style={{ border: '3px solid #C9972C' }}
        />
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative bg-white rounded-2xl p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-full transition-colors hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" style={{ color: '#5A5A56' }} />
            </button>

            {/* Large QR Code */}
            <div className="flex flex-col items-center">
              <img
                src={qrUrl}
                alt="QR Code"
                className="w-64 h-64 md:w-72 md:h-72 rounded-xl"
                style={{ border: '4px solid #C9972C' }}
              />

              <p className="text-sm font-medium mt-4 mb-4" style={{ color: '#1A1A18' }}>
                Scan to share this event
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                  style={{ backgroundColor: '#6B0000', color: 'white' }}
                >
                  <Download className="h-4 w-4" />
                  Download QR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
