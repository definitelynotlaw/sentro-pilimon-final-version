import { cn } from '@/lib/utils'
import { AnnouncementCard, type AnnouncementCardProps } from './AnnouncementCard'
import { CardSkeleton } from '@/components/shared/LoadingSkeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { Megaphone } from 'lucide-react'

interface BulletinGridProps {
  announcements: AnnouncementCardProps[]
  isLoading?: boolean
  className?: string
}

export function BulletinGrid({
  announcements,
  isLoading,
  className,
}: BulletinGridProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6',
          className
        )}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (announcements.length === 0) {
    return (
      <EmptyState
        icon={Megaphone}
        title="No announcements yet"
        description="Check back later for upcoming events and announcements from PLMun."
        className={className}
      />
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6',
        className
      )}
    >
      {announcements.map((announcement, index) => (
        <div
          key={announcement.id}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <AnnouncementCard {...announcement} />
        </div>
      ))}
    </div>
  )
}