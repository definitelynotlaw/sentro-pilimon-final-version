type Status = 'draft' | 'pending' | 'approved' | 'published' | 'archived'

interface StatusBadgeProps {
  status: Status
  size?: 'sm' | 'md'
  className?: string
}

const statusConfig: Record<Status, { label: string; bg: string; color: string }> = {
  draft: { label: 'Draft', bg: '#9A9A95', color: 'white' },
  pending: { label: 'Pending', bg: '#C9972C', color: 'white' },
  approved: { label: 'Approved', bg: '#1A6B3C', color: 'white' },
  published: { label: 'Published', bg: '#6B0000', color: 'white' },
  archived: { label: 'Archived', bg: '#5A5A56', color: 'white' },
}

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const config = statusConfig[status as Status] || statusConfig.draft

  return (
    <span
      className="inline-flex items-center font-medium rounded-full"
      style={{
        backgroundColor: config.bg,
        color: config.color,
        padding: size === 'sm' ? '2px 8px' : '4px 12px',
        fontSize: size === 'sm' ? '10px' : '12px',
      }}
    >
      {config.label}
    </span>
  )
}