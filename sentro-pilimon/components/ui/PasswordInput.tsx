'use client'

import { useState, forwardRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          ref={ref}
          className={cn(
            'w-full px-4 py-3 pr-12 rounded-lg text-base',
            'border transition-colors focus:outline-none focus:ring-2',
            error
              ? 'border-[#9B1C1C] focus:ring-[#9B1C1C]/20'
              : 'border-[#D4D4CF] focus:ring-[#6B0000]/20',
            className
          )}
          style={{
            backgroundColor: '#FFFFFF',
            color: '#1A1A18',
          }}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors hover:bg-[#F5F5F3]"
          style={{ color: '#5A5A56' }}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'