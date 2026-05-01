'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { ZoomIn, ZoomOut, Move, RotateCcw } from 'lucide-react'

interface PosterCropperProps {
  imageUrl: string
  onCropChange: (cropData: { x: number; y: number; zoom: number }) => void
}

export function PosterCropper({ imageUrl, onCropChange }: PosterCropperProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })

  const handleDragStart = (clientX: number, clientY: number) => {
    isDragging.current = true
    lastPos.current = { x: clientX, y: clientY }
  }

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging.current) return
    const dx = clientX - lastPos.current.x
    const dy = clientY - lastPos.current.y
    lastPos.current = { x: clientX, y: clientY }
    setPosition(prev => ({
      x: prev.x + dx / zoom,
      y: prev.y + dy / zoom,
    }))
  }, [zoom])

  const handleDragEnd = useCallback(() => {
    isDragging.current = false
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleDragStart(e.clientX, e.clientY)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      e.preventDefault()
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY)
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientX, e.clientY)
    const handleMouseUp = () => handleDragEnd()
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault()
        handleDragMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }
    const handleTouchEnd = () => handleDragEnd()

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleDragMove, handleDragEnd])

  useEffect(() => {
    onCropChange({ x: position.x, y: position.y, zoom })
  }, [position, zoom, onCropChange])

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.25, 3))
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.25, 0.5))
  const handleReset = () => {
    setPosition({ x: 0, y: 0 })
    setZoom(1)
  }

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="relative w-full aspect-video rounded-lg overflow-hidden cursor-move touch-none"
        style={{ backgroundColor: '#EBEBEA' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <img
          src={imageUrl}
          alt="Poster crop preview"
          className="absolute w-full h-full object-cover pointer-events-none select-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
          draggable={false}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-0 right-0 border-t border-white/20" />
          <div className="absolute top-2/3 left-0 right-0 border-t border-white/20" />
          <div className="absolute left-1/3 top-0 bottom-0 border-r border-white/20" />
          <div className="absolute left-2/3 top-0 bottom-0 border-r border-white/20" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-2 rounded-lg transition-colors"
          style={{ backgroundColor: '#F5F5F3', color: '#5A5A56' }}
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1 px-3 py-1 rounded-lg" style={{ backgroundColor: '#F5F5F3' }}>
          <Move className="h-3 w-3" style={{ color: '#9A9A95' }} />
          <span className="text-xs font-medium w-12 text-center" style={{ color: '#5A5A56' }}>
            {Math.round(zoom * 100)}%
          </span>
        </div>

        <button
          type="button"
          onClick={handleZoomIn}
          className="p-2 rounded-lg transition-colors"
          style={{ backgroundColor: '#F5F5F3', color: '#5A5A56' }}
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="p-2 rounded-lg transition-colors ml-2"
          style={{ backgroundColor: '#F5F5F3', color: '#5A5A56' }}
          title="Reset"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs text-center" style={{ color: '#9A9A95' }}>
        Drag to adjust position • Use buttons to zoom
      </p>
    </div>
  )
}
