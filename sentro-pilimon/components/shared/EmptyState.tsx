import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 text-center',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-plm-maroon-muted flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-plm-maroon" />
      </div>
      <h3 className="font-display text-lg font-semibold text-plm-gray-900 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-plm-gray-600 text-sm max-w-xs mb-6">{description}</p>
      )}
      {action}
    </div>
  )
}