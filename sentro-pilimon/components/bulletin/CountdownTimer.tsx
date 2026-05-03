'use client'
import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

interface CountdownTimerProps {
  startDate: Date
  endDate: Date
  large?: boolean
}

function getCountdownState(startDate: Date, endDate: Date) {
  const now = new Date()
  const expiredAt = new Date(endDate.getTime() + 12 * 60 * 60 * 1000)

  if (now >= expiredAt) return { label: 'Expired', color: '#9A9A95', expired: true }

  const target = now < startDate ? startDate : endDate
  const prefix = now < startDate ? 'Starts in' : 'Ends in'
  const color = now < startDate ? '#1A6B3C' : '#C9972C'
  const diff = target.getTime() - now.getTime()

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const secs = Math.floor((diff % (1000 * 60)) / 1000)

  let label = ''
  if (days > 0) label = `${prefix} ${days}d ${hours}h`
  else if (hours > 0) label = `${prefix} ${hours}h ${mins}m`
  else label = `${prefix} ${mins}m ${secs}s`

  return { label, color, expired: false }
}

export function CountdownTimer({ startDate, endDate, large = false }: CountdownTimerProps) {
  const [state, setState] = useState(() => getCountdownState(startDate, endDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setState(getCountdownState(startDate, endDate))
    }, 1000)
    return () => clearInterval(interval)
  }, [startDate, endDate])

  if (large) {
    return (
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium"
        style={{
          backgroundColor: `${state.color}18`,
          color: state.color,
          fontSize: '0.95rem',
        }}
      >
        <Clock className="h-4 w-4" />
        {state.label}
      </div>
    )
  }

  return (
    <span className="flex items-center gap-1 text-xs font-medium" style={{ color: state.color }}>
      <Clock className="h-3 w-3" />
      {state.label}
    </span>
  )
}
