'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Heart, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { submitRSVP } from '@/lib/actions/rsvp'

interface RSVPButtonProps {
  announcementId: string
  className?: string
}

export function RSVPButton({ announcementId, className }: RSVPButtonProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'none' | 'interested' | 'going'>('none')

  useEffect(() => {
    const fetchCurrentStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('rsvp_records')
        .select('rsvp_status')
        .eq('announcement_id', announcementId)
        .eq('user_id', user.id)
        .in('rsvp_status', ['going', 'interested'])
        .single()

      if (data) {
        setStatus(data.rsvp_status as 'interested' | 'going')
      }
    }

    fetchCurrentStatus()
  }, [announcementId])

  const handleRSVP = async (newStatus: 'interested' | 'going') => {
    setIsLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // Optimistically update UI
    setStatus(newStatus)

    const result = await submitRSVP(announcementId, newStatus)
    if (result.success) {
      router.refresh()
    } else {
      // Revert on failure
      setStatus('none')
    }

    setIsLoading(false)
  }

  return (
    <div className={cn('flex gap-3', className)}>
      <button
        onClick={() => handleRSVP('interested')}
        disabled={isLoading}
        className={cn(
          'flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all',
          status === 'interested'
            ? 'bg-plm-gold text-white'
            : 'bg-plm-gray-100 text-plm-gray-700 hover:bg-plm-gray-200'
        )}
      >
        <Heart className={cn('h-4 w-4', status === 'interested' && 'fill-current')} />
        Interested
      </button>

      <button
        onClick={() => handleRSVP('going')}
        disabled={isLoading}
        className={cn(
          'flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all',
          status === 'going'
            ? 'bg-plm-maroon text-white'
            : 'bg-plm-maroon-muted text-plm-maroon hover:bg-plm-maroon/10'
        )}
      >
        <Check className="h-4 w-4" />
        Going
      </button>
    </div>
  )
}
