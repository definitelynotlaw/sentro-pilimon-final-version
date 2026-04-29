// Route path constants
export const ROUTES = {
  // Public
  home: '/',
  announcement: (id: string) => `/announcement/${id}`,
  scan: '/scan',
  channels: '/channels',
  channelDept: (slug: string) => `/channels/dept/${slug}`,
  channelOrg: (slug: string) => `/channels/org/${slug}`,
  channelPlmun: '/channels/plmun',
  myFeed: '/my-feed',
  myRSVPs: '/my-rsvps',

  // Auth
  login: '/login',
  forgotPassword: '/forgot-password',
  authCallback: '/auth/callback',

  // Dashboard
  dashboard: '/dashboard',
  dashboardOfficer: '/dashboard/officer',
  dashboardOfficerCreate: '/dashboard/officer/create',
  dashboardOfficerEdit: (id: string) => `/dashboard/officer/${id}/edit`,
  dashboardModeration: '/dashboard/moderation',
  dashboardModerationReview: (id: string) => `/dashboard/moderation/${id}/review`,
  dashboardAdmin: '/dashboard/admin',
  dashboardAdminUsers: '/dashboard/admin/users',
  dashboardAdminCategories: '/dashboard/admin/categories',
  dashboardAdminAuditLogs: '/dashboard/admin/audit-logs',

  // API
  apiQRGenerate: '/api/qr/generate',
  apiRSVP: '/api/rsvp',
  apiCheckin: '/api/checkin',
  apiEmail: '/api/email',
} as const

export type RouteKey = keyof typeof ROUTES