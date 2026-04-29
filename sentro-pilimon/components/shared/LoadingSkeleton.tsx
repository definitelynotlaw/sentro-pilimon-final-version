import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  className?: string
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-plm-gray-200 rounded',
        className
      )}
      aria-hidden="true"
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-plm-gray-100">
      <LoadingSkeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <LoadingSkeleton className="h-4 w-20" />
        <LoadingSkeleton className="h-6 w-3/4" />
        <LoadingSkeleton className="h-4 w-1/2" />
        <LoadingSkeleton className="h-4 w-1/3" />
      </div>
    </div>
  )
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-plm-gray-100">
          <LoadingSkeleton className="h-12 w-12 rounded-lg" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton className="h-4 w-3/4" />
            <LoadingSkeleton className="h-3 w-1/2" />
          </div>
          <LoadingSkeleton className="h-8 w-16 rounded-full" />
        </div>
      ))}
    </div>
  )
}