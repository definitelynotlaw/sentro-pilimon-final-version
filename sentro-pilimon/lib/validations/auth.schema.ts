import { z } from 'zod'

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export type PasswordChangeData = z.infer<typeof passwordChangeSchema>

export const avatarUploadSchema = z.object({
  file: z.instanceof(File, { message: 'Please select an image file' }),
}).refine((data) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  return validTypes.includes(data.file.type)
}, {
  message: 'Only JPG, PNG, or WEBP images are allowed',
  path: ['file'],
}).refine((data) => {
  const maxSize = 2 * 1024 * 1024 // 2MB
  return data.file.size <= maxSize
}, {
  message: 'Image must be smaller than 2MB',
  path: ['file'],
})