'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface StrengthMeterProps {
  password: string
  strength: 'weak' | 'fair' | 'good' | 'strong'
  requirements: { met: boolean; label: string }[]
}

export function StrengthMeter({ password, strength, requirements }: StrengthMeterProps) {
  const colors = {
    weak: '#9B1C1C',
    fair: '#C9972C',
    good: '#1E3A5F',
    strong: '#1A6B3C',
  }

  const labels = {
    weak: 'Weak',
    fair: 'Fair',
    good: 'Good',
    strong: 'Strong',
  }

  const widthPercent = {
    weak: '25%',
    fair: '50%',
    good: '75%',
    strong: '100%',
  }

  if (!password) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span style={{ color: '#5A5A56' }}>Password strength</span>
        <span style={{ color: colors[strength], fontWeight: 500 }}>{labels[strength]}</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ backgroundColor: '#EBEBEA' }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: widthPercent[strength],
            backgroundColor: colors[strength],
          }}
        />
      </div>
      <ul className="space-y-1">
        {requirements.map((req, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <span
              className="text-base"
              style={{ color: req.met ? '#1A6B3C' : '#D4D4CF' }}
            >
              {req.met ? '✓' : '○'}
            </span>
            <span style={{ color: req.met ? '#1A6B3C' : '#9A9A95' }}>{req.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}