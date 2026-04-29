import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { Calendar, MapPin, Users } from 'lucide-react'
import { StatusBadge } from './StatusBadge'

export interface AnnouncementCardProps {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  venue?: string | null
  posterUrl?: string | null
  category: {
    name: string
    slug: string
    color: string
  }
  organization?: {
    name: string
    logoUrl?: string | null
  } | null
  goingCount: number
  interestedCount: number
  status?: 'draft' | 'pending' | 'approved' | 'published' | 'archived'
  className?: string
}

export function AnnouncementCard({
  id,
  title,
  description,
  startDate,
  venue,
  posterUrl,
  category,
  organization,
  goingCount,
  interestedCount,
  status,
  className,
}: AnnouncementCardProps) {
  const formattedDate = format(startDate, 'MMM d')
  const formattedTime = format(startDate, 'h:mm a')

  return (
    <Link
      href={`/announcement/${id}`}
      className="group block bg-white rounded-xl overflow-hidden animate-fade-in card-hover"
      style={{
        border: '1px solid #EBEBEA',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      }}
    >
      {/* Poster Image */}
      <div className="relative aspect-[16/9] overflow-hidden" style={{ backgroundColor: '#EBEBEA' }}>
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <span
              className="text-6xl font-bold opacity-30"
              style={{ color: category.color, fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {title.charAt(0)}
            </span>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span
            className="px-2 py-1 text-xs font-semibold rounded-full"
            style={{ backgroundColor: category.color, color: 'white' }}
          >
            {category.name}
          </span>
        </div>

        {/* Status Badge (if provided) */}
        {status && (
          <div className="absolute top-3 right-3">
            <StatusBadge status={status} size="sm" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="text-lg font-semibold mb-2 line-clamp-2 group-hover:underline"
          style={{
            color: '#1A1A18',
            fontFamily: "'Playfair Display', Georgia, serif",
          }}
        >
          {title}
        </h3>

        <div className="flex items-center gap-4 text-sm mb-3" style={{ color: '#5A5A56' }}>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" style={{ color: '#C9972C' }} />
            {formattedDate} · {formattedTime}
          </span>
          {venue && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" style={{ color: '#C9972C' }} />
              <span className="truncate max-w-[100px]">{venue}</span>
            </span>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: '1px solid #EBEBEA' }}
        >
          {organization && (
            <span className="text-xs truncate max-w-[120px]" style={{ color: '#9A9A95' }}>
              {organization.name}
            </span>
          )}
          <div className="flex items-center gap-3 text-xs ml-auto" style={{ color: '#9A9A95' }}>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {goingCount} going
            </span>
            <span>{interestedCount} interested</span>
          </div>
        </div>
      </div>
    </Link>
  )
}