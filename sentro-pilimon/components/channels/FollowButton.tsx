'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, PlusCircle } from 'lucide-react'

interface FollowButtonProps {
  channelType: 'org' | 'department' | 'plmun'
  channelId: string | null // null for plmun since it has no specific id
  userId: string
  className?: string
}

export function FollowButton({ channelType, channelId, userId, className = '' }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!userId) return

    const supabase = createClient()

    const checkFollow = async () => {
      let query = supabase
        .from('channel_follows')
        .select('id')
        .eq('user_id', userId)
        .eq('channel_type', channelType)
        .limit(1)

      if (channelId) {
        query = query.eq('channel_id', channelId)
      } else {
        query = query.is('channel_id', null)
      }

      const { data } = await query
      setIsFollowing(!!data && data.length > 0)
    }

    checkFollow()

    const channel = `${channelType}:${channelId || 'plmun'}`
    const subscription = supabase
      .channel(`follow-${channel}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'channel_follows',
        filter: `user_id=eq.${userId}`,
      }, () => {
        checkFollow()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId, channelType, channelId])

  const toggleFollow = async () => {
    if (!userId || isLoading) return

    setIsLoading(true)
    const supabase = createClient()

    if (isFollowing) {
      // Unfollow
      let query = supabase
        .from('channel_follows')
        .delete()
        .eq('user_id', userId)
        .eq('channel_type', channelType)

      if (channelId) {
        query = query.eq('channel_id', channelId)
      } else {
        query = query.is('channel_id', null)
      }

      await query
      setIsFollowing(false)
    } else {
      // Follow
      await supabase.from('channel_follows').insert({
        user_id: userId,
        channel_type: channelType,
        channel_id: channelId || null,
      })
      setIsFollowing(true)
    }

    setIsLoading(false)
  }

  if (!userId) return null

  return (
    <button
      onClick={toggleFollow}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${className}`}
      style={{
        backgroundColor: isFollowing ? '#EDF7F0' : '#6B0000',
        color: isFollowing ? '#1A6B3C' : 'white',
        opacity: isLoading ? 0.6 : 1,
      }}
    >
      {isFollowing ? (
        <>
          <CheckCircle className="h-4 w-4" />
          Following
        </>
      ) : (
        <>
          <PlusCircle className="h-4 w-4" />
          Follow
        </>
      )}
    </button>
  )
}