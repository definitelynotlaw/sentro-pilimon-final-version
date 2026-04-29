'use client'

import { Modal } from './Modal'
import { Button } from '@/components/ui/Button'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'default'
  isLoading?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false,
}: ConfirmDialogProps) {
  const buttonStyles = {
    danger: { bg: '#9B1C1C', hover: '#7A1515' },
    warning: { bg: '#C9972C', hover: '#A67C24' },
    default: { bg: '#6B0000', hover: '#4A0000' },
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              backgroundColor: buttonStyles[variant].bg,
              color: 'white',
            }}
          >
            {isLoading ? 'Loading...' : confirmText}
          </Button>
        </>
      }
    >
      <p style={{ color: '#5A5A56' }}>{message}</p>
    </Modal>
  )
}