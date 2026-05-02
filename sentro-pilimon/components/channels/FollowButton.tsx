'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, PlusCircle } from 'lucide-react'
import { toast } from 'sonner'

interface FollowButtonProps {
  channelType: 'org' | 'department' | 'plmun'
  channelId: string | null
  userId: string
  channelName?: string
  className?: string
}

export function FollowButton({ channelType, channelId, userId, channelName, className = '' }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)

  useEffect(() => {
    if (!userId) return
    const supabase = createClient()

    const fetchData = async () => {
      // Check if current user follows
      let followQuery = supabase
        .from('channel_follows')
        .select('id')
        .eq('user_id', userId)
        .eq('channel_type', channelType)
        .limit(1)
      if (channelId) {
        followQuery = followQuery.eq('channel_id', channelId)
      } else {
        followQuery = followQuery.is('channel_id', null)
      }
      const { data: followData } = await followQuery
      setIsFollowing(!!followData && followData.length > 0)

      // Get total follower count
      let countQuery = supabase
        .from('channel_follows')
        .select('id', { count: 'exact' })
        .eq('channel_type', channelType)
      if (channelId) {
        countQuery = countQuery.eq('channel_id', channelId)
      } else {
        countQuery = countQuery.is('channel_id', null)
      }
      const { count } = await countQuery
      setFollowerCount(count || 0)
    }

    fetchData()

    const channel = `${channelType}:${channelId || 'plmun'}`
    const subscription = supabase
      .channel(`follow-${channel}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'channel_follows',
      }, () => {
        fetchData()
      })
      .subscribe()

    return () => { subscription.unsubscribe() }
  }, [userId, channelType, channelId])

  const toggleFollow = async () => {
    if (!userId || isLoading) return
    setIsLoading(true)
    const supabase = createClient()

    if (isFollowing) {
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
      const { error } = await query
      if (!error) {
        setIsFollowing(false)
        setFollowerCount(c => Math.max(0, c - 1))
        toast.success(`Unfollowed ${channelName || 'channel'}`)
      }
    } else {
      const { error } = await supabase.from('channel_follows').insert({
        user_id: userId,
        channel_type: channelType,
        channel_id: channelId || null,
      })
      if (!error) {
        setIsFollowing(true)
        setFollowerCount(c => c + 1)
        toast.success(`Now following ${channelName || 'channel'}!`)
      } else {
        toast.error('Failed to follow. Please try again.')
      }
    }
    setIsLoading(false)
  }

  if (!userId) return null

  return (
    <div className="flex items-center gap-3">
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
      {followerCount > 0 && (
        <span className="text-sm" style={{ color: '#9A9A95' }}>
          {followerCount} {followerCount === 1 ? 'follower' : 'followers'}
        </span>
      )}
    </div>
  )
}
