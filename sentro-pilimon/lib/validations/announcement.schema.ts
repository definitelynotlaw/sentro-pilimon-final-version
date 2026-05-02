import { z } from 'zod'

// Accept datetime-local format (YYYY-MM-DDTHH:mm) + ISO variants
const datetimeString = z.string().refine(
  (val) => {
    // Allow datetime-local format: 2026-05-01T10:00
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val)) return true
    // Allow full ISO: 2026-05-01T10:00:00.000Z
    if (!isNaN(Date.parse(val))) return true
    return false
  },
  { message: 'Invalid date format' }
)

export const announcementFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(5000, 'Description too long'),
  category_id: z.string().uuid('Invalid category'),
  start_datetime: datetimeString,
  end_datetime: datetimeString,
  venue: z.string().min(1, 'Venue is required').max(500, 'Venue too long'),
  poster_url: z.string().url('Poster is required'),
  poster_crop_x: z.number().optional().nullable(),
  poster_crop_y: z.number().optional().nullable(),
  poster_zoom: z.number().optional().nullable(),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags').optional(),
  org_id: z.string().min(1, 'Organization is required'),
  office_id: z.string().optional().nullable(),
}).refine(
  (data) => new Date(data.end_datetime) > new Date(data.start_datetime),
  { message: 'End date must be after start date', path: ['end_datetime'] }
)

export type AnnouncementFormData = z.infer<typeof announcementFormSchema>

// Reconstruct schema without refinement for partial updates
const announcementUpdateBase = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  description: z.string().min(1, 'Description is required').max(5000, 'Description too long').optional(),
  category_id: z.string().uuid('Invalid category').optional(),
  start_datetime: datetimeString.optional(),
  end_datetime: datetimeString.optional(),
  venue: z.string().max(500, 'Venue too long').optional().nullable(),
  poster_url: z.string().url().or(z.literal('')).optional().nullable(),
  poster_crop_x: z.number().optional().nullable(),
  poster_crop_y: z.number().optional().nullable(),
  poster_zoom: z.number().optional().nullable(),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags').optional(),
  org_id: z.string().uuid('Invalid organization').optional().nullable(),
  office_id: z.string().uuid('Invalid office').optional().nullable(),
})

export const announcementUpdateSchema = announcementUpdateBase

export type AnnouncementUpdateData = z.infer<typeof announcementUpdateSchema>