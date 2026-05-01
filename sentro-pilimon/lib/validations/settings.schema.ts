import { z } from 'zod'

export const regionalSettingsSchema = z.object({
  timezone: z.string().min(1, 'Timezone is required'),
  dateFormat: z.enum(['MDY', 'DMY', 'YMD']),
})

export type RegionalSettings = z.infer<typeof regionalSettingsSchema>
