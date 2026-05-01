export type UserRole = 'student' | 'officer' | 'office_staff' | 'moderator' | 'admin'
export type UserStatus = 'active' | 'inactive'

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  status: UserStatus
  org_id?: string | null
  office_id?: string | null
  avatar_url?: string | null
  created_at: string
  updated_at: string
}

export type OrganizationStatus = 'active' | 'inactive'

export interface Organization {
  id: string
  name: string
  slug: string
  description?: string | null
  logo_url?: string | null
  banner_url?: string | null
  accent_color: string
  short_description?: string | null
  contact_email?: string | null
  social_links: Record<string, string>
  member_count: number
  founded_year?: number | null
  adviser_name?: string | null
  status: OrganizationStatus
  created_at: string
}

export type OfficeStatus = 'active' | 'inactive'
export type ChannelType = 'department' | 'office' | 'admin'

export interface Office {
  id: string
  name: string
  slug: string
  description?: string | null
  logo_url?: string | null
  banner_url?: string | null
  accent_color: string
  short_description?: string | null
  contact_email?: string | null
  social_links: Record<string, string>
  college?: string | null
  channel_type: ChannelType
  status: OfficeStatus
  created_at: string
}

export interface EventCategory {
  id: string
  name: string
  slug: string
  color: string
  icon?: string | null
  description?: string | null
  sort_order: number
}

export type AnnouncementStatus = 'draft' | 'pending' | 'approved' | 'published' | 'archived'

export interface Announcement {
  id: string
  title: string
  description: string
  start_datetime: string
  end_datetime: string
  venue?: string | null
  status: AnnouncementStatus
  publisher_user_id: string
  org_id?: string | null
  office_id?: string | null
  category_id: string
  poster_url?: string | null
  poster_thumbnail_url?: string | null
  poster_crop_x?: number
  poster_crop_y?: number
  poster_zoom?: number
  tags: string[]
  view_count: number
  moderator_remarks?: string | null
  reviewed_by?: string | null
  reviewed_at?: string | null
  published_at?: string | null
  created_at: string
  updated_at: string
  // Joined data
  category?: EventCategory
  organization?: Organization | null
  office?: Office | null
  publisher?: User
}

export type RSVPStatus = 'interested' | 'going' | 'attended' | 'cancelled'

export interface RSVP {
  id: string
  announcement_id: string
  user_id: string
  rsvp_status: RSVPStatus
  check_in_token?: string | null
  token_expires_at?: string | null
  token_used: boolean
  check_in_time?: string | null
  created_at: string
  updated_at: string
}

export interface QRLink {
  id: string
  announcement_id: string
  qr_code_url: string
  target_url: string
  is_active: boolean
  scan_count: number
  generated_at: string
}

export interface AuditLog {
  id: string
  user_id?: string | null
  announcement_id?: string | null
  action_type: string
  action_timestamp: string
  details: Record<string, unknown>
}

export type ChannelTypeFollow = 'org' | 'department' | 'plmun'

export interface ChannelFollow {
  id: string
  user_id: string
  channel_type: ChannelTypeFollow
  channel_id?: string | null
  followed_at: string
}

// Combined types for database queries with joins
export interface AnnouncementWithRelations extends Announcement {
  category: EventCategory
  organization: Organization | null
  office: Office | null
  publisher: User
  rsvp_counts?: {
    going: number
    interested: number
  }
}

// API response types
export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Filter types
export interface BulletinFilters {
  category?: string
  search?: string
  org?: string
  office?: string
  status?: AnnouncementStatus
  startDate?: string
  endDate?: string
}

export interface UserFilters {
  role?: UserRole
  status?: UserStatus
  search?: string
}