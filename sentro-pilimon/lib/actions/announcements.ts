'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { announcementFormSchema, type AnnouncementFormData } from '@/lib/validations/announcement.schema'
import type { APIResponse, AnnouncementWithRelations, BulletinFilters } from '@/types/database'

export async function createAnnouncement(
  formData: AnnouncementFormData
): Promise<APIResponse<{ id: string }>> {
  try {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
      return { success: false, error: 'Unauthorized' }
    }

    const validation = announcementFormSchema.safeParse(formData)
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0].message }
    }

    const { data, error } = await supabase
      .from('announcements')
      .insert({
        ...validation.data,
        publisher_user_id: userData.user.id,
        status: 'draft',
      })
      .select('id')
      .single()

    if (error) {
      console.error('Create announcement error:', error)
      return { success: false, error: 'Failed to create announcement' }
    }

    await supabase.from('audit_logs').insert({
      user_id: userData.user.id,
      announcement_id: data.id,
      action_type: 'CREATE',
      details: { title: formData.title },
    })

    revalidatePath('/dashboard/officer')
    return { success: true, data: { id: data.id } }
  } catch (error) {
    console.error('Create announcement error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateAnnouncement(
  id: string,
  formData: Partial<AnnouncementFormData>
): Promise<APIResponse<{ id: string }>> {
  try {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data, error } = await supabase
      .from('announcements')
      .update({ ...formData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('publisher_user_id', userData.user.id)
      .eq('status', 'draft')
      .select('id')
      .single()

    if (error) {
      console.error('Update announcement error:', error)
      return { success: false, error: 'Failed to update announcement' }
    }

    await supabase.from('audit_logs').insert({
      user_id: userData.user.id,
      announcement_id: id,
      action_type: 'UPDATE',
      details: { fields: Object.keys(formData) },
    })

    revalidatePath('/dashboard/officer')
    revalidatePath(`/announcement/${id}`)
    return { success: true, data: { id } }
  } catch (error) {
    console.error('Update announcement error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function submitForApproval(id: string): Promise<APIResponse<{ id: string }>> {
  try {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data, error } = await supabase
      .from('announcements')
      .update({ status: 'pending', updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('publisher_user_id', userData.user.id)
      .eq('status', 'draft')
      .select('id')
      .single()

    if (error) {
      console.error('Submit for approval error:', error)
      return { success: false, error: 'Failed to submit for approval' }
    }

    await supabase.from('audit_logs').insert({
      user_id: userData.user.id,
      announcement_id: id,
      action_type: 'SUBMIT_FOR_APPROVAL',
    })

    revalidatePath('/dashboard/officer')
    return { success: true, data: { id } }
  } catch (error) {
    console.error('Submit for approval error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function archiveAnnouncement(id: string): Promise<APIResponse<{ id: string }>> {
  try {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data, error } = await supabase
      .from('announcements')
      .update({ status: 'archived', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id')
      .single()

    if (error) {
      console.error('Archive announcement error:', error)
      return { success: false, error: 'Failed to archive announcement' }
    }

    await supabase.from('audit_logs').insert({
      user_id: userData.user.id,
      announcement_id: id,
      action_type: 'ARCHIVE',
    })

    revalidatePath('/dashboard/officer')
    revalidatePath(`/announcement/${id}`)
    return { success: true, data: { id } }
  } catch (error) {
    console.error('Archive announcement error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function getPublishedAnnouncements(
  filters: BulletinFilters = {}
): Promise<APIResponse<AnnouncementWithRelations[]>> {
  try {
    const supabase = await createClient()

    let query = supabase
      .from('announcements')
      .select(`
        *,
        category:event_categories(*),
        organization:organizations(*),
        office:offices(*),
        publisher:users(*)
      `)
      .eq('status', 'published')
      .order('start_datetime', { ascending: true })
      .gt('end_datetime', new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString())

    if (filters.category) {
      query = query.eq('category_id', filters.category)
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters.startDate) {
      query = query.gte('start_datetime', filters.startDate)
    }

    if (filters.endDate) {
      query = query.lte('end_datetime', filters.endDate)
    }

    const { data, error } = await query

    if (error) {
      console.error('Get published announcements error:', error)
      return { success: false, error: 'Failed to fetch announcements' }
    }

    // Get RSVP counts for each announcement
    const announcementsWithCounts = await Promise.all(
      (data || []).map(async (announcement) => {
        const { data: rsvpData } = await supabase
          .from('rsvp_records')
          .select('rsvp_status')
          .eq('announcement_id', announcement.id)
          .in('rsvp_status', ['going', 'interested'])

        const going = rsvpData?.filter(r => r.rsvp_status === 'going').length || 0
        const interested = rsvpData?.filter(r => r.rsvp_status === 'interested').length || 0

        return {
          ...announcement,
          rsvp_counts: { going, interested }
        }
      })
    )

    return { success: true, data: announcementsWithCounts }
  } catch (error) {
    console.error('Get published announcements error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function getAnnouncementById(
  id: string
): Promise<APIResponse<AnnouncementWithRelations>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('announcements')
      .select(`
        *,
        category:event_categories(*),
        organization:organizations(*),
        office:offices(*),
        publisher:users(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Get announcement by id error:', error)
      return { success: false, error: 'Announcement not found' }
    }

    // Increment view count
    await supabase.rpc('increment_view_count', { announcement_uuid: id })

    // Get RSVP counts
    const { data: rsvpData } = await supabase
      .from('rsvp_records')
      .select('rsvp_status')
      .eq('announcement_id', id)
      .in('rsvp_status', ['going', 'interested'])

    const going = rsvpData?.filter(r => r.rsvp_status === 'going').length || 0
    const interested = rsvpData?.filter(r => r.rsvp_status === 'interested').length || 0

    return {
      success: true,
      data: {
        ...data,
        rsvp_counts: { going, interested }
      }
    }
  } catch (error) {
    console.error('Get announcement by id error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}