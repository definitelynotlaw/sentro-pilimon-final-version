'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, X, Link } from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'

export default function ScanPage() {
  const router = useRouter()
  const [isSupported, setIsSupported] = useState(true)
  const [isScanning, setIsScanning] = useState(false)
  const [manualUrl, setManualUrl] = useState('')
  const [error, setError] = useState('')
  const [cameraError, setCameraError] = useState('')
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false)
    }
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [])

  const handleClose = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop() } catch {}
    }
    router.push('/')
  }

  const startScanner = async () => {
    if (!containerRef.current) return
    try {
      setError('')
      setCameraError('')
      setIsScanning(true)
      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 200, height: 200 } },
        (decodedText) => {
          const match = decodedText.match(/announcement\/([a-f0-9-]+)/i)
          if (match) {
            scanner.stop().then(() => { router.push(`/announcement/${match[1]}`) })
          } else if (decodedText.startsWith('/announcement/')) {
            scanner.stop().then(() => { router.push(decodedText) })
          } else {
            setError('Invalid QR code. This is not a Sentro Pilimon QR code.')
          }
        },
        () => {}
      )
    } catch (err) {
      setIsScanning(false)
      if (err instanceof Error) {
        if (err.message.includes('permission')) {
          setCameraError('Camera permission denied. Please allow camera access.')
        } else if (err.message.includes('NotFoundError')) {
          setCameraError('No camera found on this device.')
        } else {
          setCameraError('Could not start camera. Try manual entry below.')
        }
      }
    }
  }

  const stopScanner = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop() } catch {}
    }
    setIsScanning(false)
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white">Scan QR Code</h1>
          <button onClick={handleClose} className="p-2">
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        <div
          className="relative w-full aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden mb-6"
          style={{ backgroundColor: '#2C2C2A' }}
        >
          <div id="qr-reader" ref={containerRef} className="w-full h-full" />

          {!isScanning && !cameraError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-sm opacity-70 mb-4">Camera not active</p>
                {isSupported && (
                  <button
                    onClick={startScanner}
                    className="px-6 py-3 rounded-lg font-medium"
                    style={{ backgroundColor: '#6B0000', color: 'white' }}
                  >
                    Start Scanner
                  </button>
                )}
              </div>
            </div>
          )}


          <div
            className="absolute pointer-events-none"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px' }}
          >
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 rounded-tl-xl" style={{ borderColor: '#C9972C' }} />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 rounded-tr-xl" style={{ borderColor: '#C9972C' }} />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 rounded-bl-xl" style={{ borderColor: '#C9972C' }} />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 rounded-br-xl" style={{ borderColor: '#C9972C' }} />
          </div>
        </div>

        {cameraError && (
          <p className="text-center text-sm mb-4 px-4 py-2 rounded-lg" style={{ backgroundColor: 'rgba(155, 28, 28, 0.2)', color: '#F87171' }}>
            {cameraError}
          </p>
        )}

        {error && (
          <p className="text-center text-sm mb-4" style={{ color: '#F87171' }}>
            {error}
          </p>
        )}

        <p className="text-center text-sm mb-6" style={{ color: '#9A9A95' }}>
          Point camera at a Sentro Pilimon QR code
        </p>

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
                  style={{ backgroundColor: '#2C2C2A', color: 'white', border: '1px solid #3C3C3A', outline: 'none' }}
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
          </form>
        </div>
      </div>
    </main>
  )
}
