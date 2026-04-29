'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Heart, Check, LogIn } from 'lucide-react'
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

  const handleRSVP = async (newStatus: 'interested' | 'going') => {
    setIsLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const result = await submitRSVP(announcementId, newStatus)
    if (result.success) {
      setStatus(newStatus)
      router.refresh()
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