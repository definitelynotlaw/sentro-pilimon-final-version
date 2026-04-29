'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { rsvpFormSchema, type RSVPFormData } from '@/lib/validations/rsvp.schema'
import { generateCheckinToken } from '@/lib/qr'
import type { APIResponse } from '@/types/database'

export async function submitRSVP(
  announcementId: string,
  rsvpStatus: 'interested' | 'going' | 'attended' | 'cancelled'
): Promise<APIResponse<{ id: string }>> {
  try {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if RSVP already exists
    const { data: existingRSVP } = await supabase
      .from('rsvp_records')
      .select('id')
      .eq('announcement_id', announcementId)
      .eq('user_id', userData.user.id)
      .single()

    let rsvpId: string

    if (existingRSVP) {
      // Update existing RSVP
      const { data, error } = await supabase
        .from('rsvp_records')
        .update({
          rsvp_status: rsvpStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingRSVP.id)
        .select('id')
        .single()

      if (error) {
        console.error('Update RSVP error:', error)
        return { success: false, error: 'Failed to update RSVP' }
      }

      rsvpId = data.id
    } else {
      // Generate check-in token for 'going' status
      let checkInToken: string | undefined
      let tokenExpiresAt: Date | undefined

      if (rsvpStatus === 'going') {
        const tokenData = generateCheckinToken('')
        checkInToken = tokenData.token
        tokenExpiresAt = tokenData.expiresAt
      }

      // Create new RSVP
      const { data, error } = await supabase
        .from('rsvp_records')
        .insert({
          announcement_id: announcementId,
          user_id: userData.user.id,
          rsvp_status: rsvpStatus,
          check_in_token: checkInToken,
          token_expires_at: tokenExpiresAt?.toISOString(),
        })
        .select('id')
        .single()

      if (error) {
        console.error('Create RSVP error:', error)
        return { success: false, error: 'Failed to submit RSVP' }
      }

      rsvpId = data.id
    }

    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: userData.user.id,
      announcement_id: announcementId,
      action_type: 'RSVP',
      details: { status: rsvpStatus },
    })

    revalidatePath(`/announcement/${announcementId}`)
    return { success: true, data: { id: rsvpId } }
  } catch (error) {
    console.error('Submit RSVP error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function validateCheckinToken(
  token: string,
  rsvpId: string
): Promise<APIResponse<{ valid: boolean; rsvp: { announcementId: string; userId: string } }>> {
  try {
    const supabase = await createClient()

    const { data: rsvp, error } = await supabase
      .from('rsvp_records')
      .select('id, announcement_id, user_id, token_expires_at, token_used')
      .eq('check_in_token', token)
      .eq('id', rsvpId)
      .single()

    if (error || !rsvp) {
      return { success: false, error: 'Invalid check-in token' }
    }

    if (rsvp.token_used) {
      return { success: false, error: 'Token already used' }
    }

    if (new Date(rsvp.token_expires_at) < new Date()) {
      return { success: false, error: 'Token expired' }
    }

    // Mark token as used
    await supabase
      .from('rsvp_records')
      .update({
        token_used: true,
        check_in_time: new Date().toISOString(),
        rsvp_status: 'attended',
      })
      .eq('id', rsvpId)

    return {
      success: true,
      data: {
        valid: true,
        rsvp: {
          announcementId: rsvp.announcement_id,
          userId: rsvp.user_id,
        },
      },
    }
  } catch (error) {
    console.error('Validate checkin token error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function getMyRSVPs(): Promise<APIResponse<Array<{
  id: string
  announcement: {
    id: string
    title: string
    start_datetime: string
    venue: string | null
    poster_url: string | null
  }
  rsvp_status: string
  check_in_time: string | null
}>>> {
  try {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
      return { success: false, error: 'Unauthorized' }
    }

    const result = await supabase
      .from('rsvp_records')
      .select(`
        id,
        rsvp_status,
        check_in_time,
        announcement:announcements(
          id,
          title,
          start_datetime,
          venue,
          poster_url
        )
      `)
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })

    if (result.error) {
      console.error('Get RSVPs error:', result.error)
      return { success: false, error: 'Failed to fetch RSVPs' }
    }

    const rsvps = (result.data || []).map(r => ({
      id: r.id as string,
      rsvp_status: r.rsvp_status as string,
      check_in_time: r.check_in_time as string | null,
      announcement: Array.isArray(r.announcement) ? r.announcement[0] : r.announcement,
    }))

    return { success: true, data: rsvps }
  } catch (error) {
    console.error('Get RSVPs error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}