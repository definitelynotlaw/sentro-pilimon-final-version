import { z } from 'zod'

export const appearanceSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  fontSize: z.enum(['small', 'medium', 'large']),
  highContrast: z.boolean(),
  reducedMotion: z.boolean(),
})

export const regionalSettingsSchema = z.object({
  timezone: z.string().min(1, 'Timezone is required'),
  dateFormat: z.enum(['MDY', 'DMY', 'YMD']),
})

export type AppearanceSettings = z.infer<typeof appearanceSettingsSchema>
export type RegionalSettings = z.infer<typeof regionalSettingsSchema>