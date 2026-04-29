'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { announcementFormSchema, type AnnouncementFormData } from '@/lib/validations/announcement.schema'

interface Category {
  id: string
  name: string
  slug: string
  color: string
}

interface Organization {
  id: string
  name: string
  slug: string
}

interface AnnouncementFormProps {
  categories: Category[]
  organizations: Organization[]
  initialData?: Partial<AnnouncementFormData>
  onSubmit?: (data: AnnouncementFormData) => Promise<{ success: boolean; error?: string }>
}

export function AnnouncementForm({
  categories,
  organizations,
  initialData,
  onSubmit,
}: AnnouncementFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [posterPreview, setPosterPreview] = useState<string | null>(initialData?.poster_url || null)
  const [isUploading, setIsUploading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      category_id: initialData?.category_id || '',
      start_datetime: initialData?.start_datetime || '',
      end_datetime: initialData?.end_datetime || '',
      venue: initialData?.venue || '',
      poster_url: initialData?.poster_url || undefined,
      tags: initialData?.tags || [],
      org_id: initialData?.org_id || undefined,
    },
  })

  const watchedCategory = watch('category_id')

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', 'event-posters')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.error) {
        console.error('Upload error:', result.error)
        setIsUploading(false)
        return
      }

      setPosterPreview(result.url)
      setValue('poster_url', result.url)
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  const processSubmit = async (data: AnnouncementFormData) => {
    setIsSubmitting(true)
    try {
      // Clean up empty strings
      const cleanedData = {
        title: data.title,
        description: data.description,
        category_id: data.category_id,
        start_datetime: data.start_datetime,
        end_datetime: data.end_datetime,
        venue: data.venue || '',
        poster_url: data.poster_url || null,
        org_id: data.org_id || null,
      }

      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      })

      const result = await response.json()

      if (result.success) {
        setSuccessMessage('Announcement created successfully! Redirecting...')
        setTimeout(() => {
          router.push('/dashboard/officer')
          router.refresh()
        }, 1500)
      } else {
        alert(result.error || 'Failed to create announcement')
      }
    } catch (err) {
      console.error('Submit error:', err)
      alert('An error occurred while creating the announcement')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div
          className="p-4 rounded-lg text-sm flex items-center gap-2"
          style={{ backgroundColor: '#EDF7F0', color: '#1A6B3C', border: '1px solid #1A6B3C' }}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {successMessage}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#5A5A56' }}>
          Announcement Title *
        </label>
        <input
          {...register('title')}
          type="text"
          placeholder="Enter announcement title"
          className="w-full px-4 py-3 rounded-lg text-base"
          style={{
            border: errors.title ? '2px solid #9B1C1C' : '1px solid #D4D4CF',
            outline: 'none',
          }}
        />
        {errors.title && (
          <p className="text-xs mt-1" style={{ color: '#9B1C1C' }}>
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#5A5A56' }}>
          Category *
        </label>
        <select
          {...register('category_id')}
          className="w-full px-4 py-3 rounded-lg text-base"
          style={{
            border: errors.category_id ? '2px solid #9B1C1C' : '1px solid #D4D4CF',
            outline: 'none',
            backgroundColor: 'white',
          }}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="text-xs mt-1" style={{ color: '#9B1C1C' }}>
            {errors.category_id.message}
          </p>
        )}
      </div>

      {/* Organization (optional) */}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#5A5A56' }}>
          Organization / Office
        </label>
        <select
          {...register('org_id')}
          className="w-full px-4 py-3 rounded-lg text-base"
          style={{
            border: '1px solid #D4D4CF',
            outline: 'none',
            backgroundColor: 'white',
          }}
        >
          <option value="">None</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      {/* Poster Upload */}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#5A5A56' }}>
          Event Poster
        </label>
        <div
          className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors"
          style={{ borderColor: '#D4D4CF', backgroundColor: posterPreview ? 'transparent' : '#FAFAF7' }}
        >
          {posterPreview ? (
            <div className="relative">
              <img
                src={posterPreview}
                alt="Poster preview"
                className="max-h-48 mx-auto rounded-lg object-contain"
              />
              <button
                type="button"
                onClick={() => {
                  setPosterPreview(null)
                  setValue('poster_url', undefined)
                }}
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#9B1C1C', color: 'white' }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handlePosterUpload}
                className="hidden"
              />
              {isUploading ? (
                <Loader2 className="h-8 w-8 mx-auto animate-spin" style={{ color: '#9A9A95' }} />
              ) : (
                <>
                  <Upload className="h-8 w-8 mx-auto mb-2" style={{ color: '#9A9A95' }} />
                  <p className="text-sm" style={{ color: '#5A5A56' }}>
                    Tap to upload image
                  </p>
                  <p className="text-xs" style={{ color: '#9A9A95' }}>
                    or drag and drop
                  </p>
                </>
              )}
            </label>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#5A5A56' }}>
          Description *
        </label>
        <textarea
          {...register('description')}
          placeholder="Describe the event or announcement..."
          rows={5}
          className="w-full px-4 py-3 rounded-lg text-base resize-none"
          style={{
            border: errors.description ? '2px solid #9B1C1C' : '1px solid #D4D4CF',
            outline: 'none',
          }}
        />
        {errors.description && (
          <p className="text-xs mt-1" style={{ color: '#9B1C1C' }}>
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Date/Time Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#5A5A56' }}>
            Start Date & Time *
          </label>
          <input
            {...register('start_datetime')}
            type="datetime-local"
            className="w-full px-4 py-3 rounded-lg text-base"
            style={{
              border: errors.start_datetime ? '2px solid #9B1C1C' : '1px solid #D4D4CF',
              outline: 'none',
            }}
          />
          {errors.start_datetime && (
            <p className="text-xs mt-1" style={{ color: '#9B1C1C' }}>
              {errors.start_datetime.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#5A5A56' }}>
            End Date & Time *
          </label>
          <input
            {...register('end_datetime')}
            type="datetime-local"
            className="w-full px-4 py-3 rounded-lg text-base"
            style={{
              border: errors.end_datetime ? '2px solid #9B1C1C' : '1px solid #D4D4CF',
              outline: 'none',
            }}
          />
          {errors.end_datetime && (
            <p className="text-xs mt-1" style={{ color: '#9B1C1C' }}>
              {errors.end_datetime.message}
            </p>
          )}
        </div>
      </div>

      {/* Venue */}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#5A5A56' }}>
          Venue
        </label>
        <input
          {...register('venue')}
          type="text"
          placeholder="PLMun Gymnasium"
          className="w-full px-4 py-3 rounded-lg text-base"
          style={{ border: '1px solid #D4D4CF', outline: 'none' }}
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-3 font-medium rounded-lg transition-colors"
          style={{
            backgroundColor: '#F5F5F3',
            color: '#5A5A56',
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          style={{
            backgroundColor: '#6B0000',
            color: 'white',
            opacity: isSubmitting ? 0.5 : 1,
          }}
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {initialData ? 'Update' : 'Create'} Announcement
        </button>
      </div>
    </form>
  )
}