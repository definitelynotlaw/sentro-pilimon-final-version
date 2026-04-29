'use client'

import { useState, useCallback } from 'react'

interface PasswordRequirement {
  met: boolean
  label: string
}

interface UsePasswordStrengthReturn {
  password: string
  setPassword: (password: string) => void
  strength: 'weak' | 'fair' | 'good' | 'strong'
  requirements: PasswordRequirement[]
  isValid: boolean
}

const REQUIREMENTS = [
  { key: 'length', label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { key: 'upper', label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { key: 'lower', label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { key: 'number', label: 'One number', test: (p: string) => /[0-9]/.test(p) },
]

function calculateStrength(password: string, requirementsMet: number): 'weak' | 'fair' | 'good' | 'strong' {
  if (password.length === 0) return 'weak'
  if (requirementsMet <= 1) return 'weak'
  if (requirementsMet === 2) return 'fair'
  if (requirementsMet === 3) return 'good'
  return 'strong'
}

export function usePasswordStrength(): UsePasswordStrengthReturn {
  const [password, setPassword] = useState('')

  const requirements = REQUIREMENTS.map(req => ({
    met: req.test(password),
    label: req.label,
  }))

  const requirementsMet = requirements.filter(r => r.met).length
  const strength = calculateStrength(password, requirementsMet)
  const isValid = requirementsMet >= 4

  return {
    password,
    setPassword,
    strength,
    requirements,
    isValid,
  }
}