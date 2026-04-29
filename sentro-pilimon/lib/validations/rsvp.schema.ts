import { z } from 'zod'

export const rsvpFormSchema = z.object({
  announcement_id: z.string().uuid('Invalid announcement'),
  rsvp_status: z.enum(['interested', 'going', 'attended', 'cancelled']),
})

export type RSVPFormData = z.infer<typeof rsvpFormSchema>

export const checkinTokenSchema = z.object({
  token: z.string().min(1, 'Token required'),
  rsvp_id: z.string().uuid('Invalid RSVP'),
  expires_at: z.string().datetime('Invalid expiry'),
})