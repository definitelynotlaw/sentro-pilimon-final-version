import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'

    const variants = {
      default: {
        bg: '#6B0000',
        hover: '#4A0000',
        text: 'white',
        focusRing: '#6B0000/50',
      },
      outline: {
        bg: 'transparent',
        hover: '#F5F5F3',
        text: '#5A5A56',
        focusRing: '#6B0000/50',
      },
      ghost: {
        bg: 'transparent',
        hover: '#F5F5F3',
        text: '#5A5A56',
        focusRing: '#6B0000/50',
      },
      danger: {
        bg: '#9B1C1C',
        hover: '#7A1515',
        text: 'white',
        focusRing: '#9B1C1C/50',
      },
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    const v = variants[variant]

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          sizes[size],
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        style={{
          backgroundColor: v.bg,
          color: v.text,
        }}
        onMouseEnter={(e) => {
          if (!disabled && !isLoading) e.currentTarget.style.backgroundColor = v.hover
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = v.bg
        }}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'