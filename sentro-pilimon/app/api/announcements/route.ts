import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

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
    const { title, description, category_id, start_datetime, end_datetime, venue, poster_url, org_id } = body

    // Determine if org_id is an org or office
    let finalOrgId: string | null = null
    let finalOfficeId: string | null = null

    if (org_id) {
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

    const insertData = {
      title,
      description,
      category_id,
      start_datetime,
      end_datetime,
      venue: venue || null,
      poster_url: poster_url || null,
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