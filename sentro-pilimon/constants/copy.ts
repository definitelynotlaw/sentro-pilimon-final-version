// User-facing copy text for the application
// Use these constants instead of hardcoded strings for localization support

export const COPY = {
  // App
  appName: 'Sentro Pilimon',
  appTagline: 'Official PLMun Campus Bulletin',

  // Navigation
  nav: {
    home: 'Home',
    channels: 'Channels',
    scan: 'Scan',
    myFeed: 'My Feed',
    profile: 'Profile',
    about: 'About',
    signIn: 'Sign In',
    signOut: 'Sign Out',
  },

  // Bulletin
  bulletin: {
    title: 'Campus Bulletin',
    subtitle: 'Stay updated with the latest announcements and events',
    noAnnouncements: 'No announcements yet',
    noAnnouncementsDesc: 'Check back later for upcoming events and announcements from PLMun.',
    searchPlaceholder: 'Search announcements...',
    filterAll: 'All',
  },

  // Announcement
  announcement: {
    viewDetails: 'View Details',
    going: 'going',
    interested: 'interested',
    aboutEvent: 'About this Event',
    scanQR: 'Scan QR to share',
    rsvpSuccess: 'RSVP confirmed!',
    rsvpError: 'Failed to submit RSVP',
    loginToRsvp: 'Log in to RSVP',
  },

  // Categories
  categories: {
    academic: 'Academic',
    cocurricular: 'Co-curricular',
    administrative: 'Administrative',
    recruitment: 'Recruitment',
    sports: 'Sports',
    cultural: 'Cultural',
    communityService: 'Community Service',
    general: 'General',
  },

  // Channels
  channels: {
    title: 'Channels',
    subtitle: 'Browse by department or organization',
    departments: 'Departments',
    organizations: 'Organizations',
    plmunGeneral: 'PLMun General',
    seeAll: 'See all',
    followers: 'followers',
    announcements: 'announcements',
  },

  // RSVP
  rsvp: {
    interested: 'Interested',
    going: 'Going',
    attended: 'Attended',
    cancelled: 'Cancelled',
  },

  // Status
  status: {
    draft: 'Draft',
    pending: 'Pending',
    approved: 'Approved',
    published: 'Published',
    archived: 'Archived',
  },

  // Actions
  actions: {
    save: 'Save',
    saveDraft: 'Save Draft',
    submit: 'Submit',
    submitForApproval: 'Submit for Approval',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    approve: 'Approve',
    reject: 'Reject',
    returnForRevision: 'Return for Revision',
    downloadQR: 'Download QR Code',
    copyLink: 'Copy Link',
    follow: 'Follow',
    unfollow: 'Unfollow',
  },

  // Dashboard
  dashboard: {
    myAnnouncements: 'My Announcements',
    createAnnouncement: 'Create Announcement',
    editAnnouncement: 'Edit Announcement',
    pendingReview: 'Pending Review',
    allUsers: 'All Users',
    auditLogs: 'Audit Logs',
    categories: 'Categories',
    noAnnouncements: 'You haven\'t created any announcements yet.',
    noAnnouncementsDesc: 'Create your first announcement to get started.',
    pendingQueue: 'Pending Queue',
    noPending: 'No pending announcements to review.',
  },

  // Forms
  forms: {
    title: 'Title',
    titlePlaceholder: 'Enter announcement title',
    description: 'Description',
    descriptionPlaceholder: 'Describe the event or announcement...',
    category: 'Category',
    selectCategory: 'Select a category',
    startDateTime: 'Start Date & Time',
    endDateTime: 'End Date & Time',
    venue: 'Venue',
    venuePlaceholder: 'Enter venue location',
    poster: 'Event Poster',
    uploadPoster: 'Tap to upload image',
    dragDropPoster: 'or drag and drop',
    tags: 'Tags',
    tagsPlaceholder: 'Add tags (comma separated)',
  },

  // Validation
  validation: {
    titleRequired: 'Title is required',
    descriptionRequired: 'Description is required',
    categoryRequired: 'Category is required',
    startDateRequired: 'Start date is required',
    endDateRequired: 'End date is required',
    endAfterStart: 'End date must be after start date',
  },

  // Errors
  errors: {
    generic: 'Something went wrong. Please try again.',
    notFound: 'Not found',
    unauthorized: 'Please log in to continue',
    forbidden: 'You do not have permission to perform this action',
    serverError: 'Server error. Please try again later.',
    networkError: 'Network error. Please check your connection.',
  },

  // QR Scanner
  scanner: {
    title: 'Scan QR Code',
    instruction: 'Point at a Sentro Pilimon QR code',
    notSupported: 'Camera is not supported on this device',
    permissionDenied: 'Camera permission denied',
    invalidQR: 'Invalid QR code',
    manualEntry: 'Or enter URL manually',
    manualPlaceholder: 'Enter announcement URL',
  },

  // Footer
  footer: {
    copyright: '© 2026 Pamantasan ng Lungsod ng Muntinlupa',
    rightsReserved: 'All rights reserved.',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    contact: 'Contact Us',
  },
} as const

export type CopyKey = keyof typeof COPY