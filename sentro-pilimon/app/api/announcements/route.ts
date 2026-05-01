import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { allOrganizations, studentCouncils, departmentOrganizations, universityOrganizations, serviceOffices } from '@/data/organizations'

// Build a set of all known org and office IDs from static data
const staticOrgIds = new Set([
  ...studentCouncils.map(o => o.id),
  ...Object.values(departmentOrganizations).flat().map(o => o.id),
  ...universityOrganizations.map(o => o.id),
])

const staticOfficeIds = new Set([
  ...serviceOffices.map(o => o.id),
])

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll() {},
        },
      }
    )

    // Get user from request cookies (not service role client)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, category_id, start_datetime, end_datetime, venue, poster_url, poster_crop_x, poster_crop_y, poster_zoom, org_id } = body

    // For static orgs, we set org_id = NULL since they're not in the database
    // The announcement will still show on home page but won't filter by channel
    let finalOrgId: string | null = null
    let finalOfficeId: string | null = null

    if (org_id) {
      // Check if it's a static organization
      if (staticOrgIds.has(org_id)) {
        // Static org - don't set org_id since it's not in DB
        finalOrgId = null
      }
      // Check if it's a static office
      else if (staticOfficeIds.has(org_id)) {
        // Static office - don't set office_id since it's not in DB
        finalOfficeId = null
      }
      // Otherwise check database
      else {
        const { data: orgCheck } = await supabase
          .from('organizations')
          .select('id')
          .eq('id', org_id)
          .single()

        if (orgCheck) {
          finalOrgId = org_id
        } else {
          const { data: officeCheck } = await supabase
            .from('offices')
            .select('id')
            .eq('id', org_id)
            .single()

          if (officeCheck) {
            finalOfficeId = org_id
          }
        }
      }
    }

    const insertData = {
      title,
      description,
      category_id,
      start_datetime,
      end_datetime,
      venue: venue || null,
      poster_url: poster_url || null,
      poster_crop_x: poster_crop_x || 0,
      poster_crop_y: poster_crop_y || 0,
      poster_zoom: poster_zoom || 1,
      publisher_user_id: user.id,
      org_id: finalOrgId,
      office_id: finalOfficeId,
      status: 'draft',
    }

    const { data, error } = await supabase
      .from('announcements')
      .insert(insertData)
      .select('id')
      .single()

    if (error) {
      console.error('Announcement insert error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: { id: data.id } })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll() {},
        },
      }
    )

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, description, category_id, start_datetime, end_datetime, venue, poster_url, poster_crop_x, poster_crop_y, poster_zoom, org_id } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Announcement ID required' }, { status: 400 })
    }

    // For static orgs, we set org_id = NULL since they're not in the database
    let finalOrgId: string | null = null
    let finalOfficeId: string | null = null

    if (org_id) {
      if (staticOrgIds.has(org_id)) {
        finalOrgId = null
      } else if (staticOfficeIds.has(org_id)) {
        finalOfficeId = null
      } else {
        const { data: orgCheck } = await supabase
          .from('organizations')
          .select('id')
          .eq('id', org_id)
          .single()

        if (orgCheck) {
          finalOrgId = org_id
        } else {
          const { data: officeCheck } = await supabase
            .from('offices')
            .select('id')
            .eq('id', org_id)
            .single()

          if (officeCheck) {
            finalOfficeId = org_id
          }
        }
      }
    }

    const updateData: any = {
      title,
      description,
      category_id,
      start_datetime,
      end_datetime,
      venue: venue || null,
      poster_url: poster_url || null,
      poster_crop_x: poster_crop_x || 0,
      poster_crop_y: poster_crop_y || 0,
      poster_zoom: poster_zoom || 1,
      org_id: finalOrgId,
      office_id: finalOfficeId,
    }

    const { error } = await supabase
      .from('announcements')
      .update(updateData)
      .eq('id', id)
      .eq('publisher_user_id', user.id)

    if (error) {
      console.error('Announcement update error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}