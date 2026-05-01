import { cn } from '@/lib/utils'
interface PLMunLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}
export function PLMunLogo({ className, size = 'md' }: PLMunLogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20',
  }
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(sizeClasses[size], className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Sentro Pilimon Logo"
    >
      <circle cx="50" cy="50" r="48" fill="#6B0000" stroke="#C9972C" strokeWidth="2" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#C9972C" strokeWidth="1.5" />
      <text
        x="50"
        y="55"
        textAnchor="middle"
        fill="#C9972C"
        fontSize="28"
        fontFamily="Georgia, serif"
        fontWeight="bold"
      >
        SP
      </text>
    </svg>
  )
}
